#!/usr/bin/env node
// Build-time fetch of real university data for SheerIDGeneto.
//
// Source: Urban Institute Education Data API (IPEDS directory), an open-data
// API maintained by the Urban Institute:
//   https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2022/
//
// What it does:
//   1. Downloads the IPEDS directory (all US institutions, one request).
//   2. Keeps currently-active, 4-year institutions that have a street address.
//   3. Trims each record to the fields the document generator needs and
//      writes them to src/data/universities.json.
//   4. Downloads the Hipo university-domains-list (worldwide, MIT licensed),
//      keeps the configured countries (ES/NG/JP/GB/CA/MX) and writes
//      src/data/universities_intl.json (names + domains; no street addresses
//      in that source).
//
// Caching: the download is skipped when the output file exists and is newer
// than MAX_AGE_DAYS (override with --force). If the download fails but a
// cached file exists, the build keeps going with a warning; the generator
// falls back to fictional data when the file is missing/empty, so the
// build never breaks because of network issues.
import { writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'universities.json');
const OUT_INTL = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'universities_intl.json');
const API_URL = 'https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2022/';
// Hipo "university-domains-list": worldwide names + domains (no street addresses).
const HIPO_URL =
  'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';
const HIPO_COUNTRIES = ['ES', 'NG', 'JP', 'GB', 'CA', 'MX']; // Spain (incl. UNED), Nigeria, Japan + UK, Canada, Mexico
const MAX_AGE_DAYS = 30;
const force = process.argv.includes('--force');
const UA = { 'User-Agent': 'SheerIDGeneto build script (university data refresh)' };

const cacheFresh = (path) =>
  !force && existsSync(path) && (Date.now() - statSync(path).mtimeMs) / 86_400_000 < MAX_AGE_DAYS;

// Normalization for cross-dataset name matching (IPEDS <-> Hipo).
const normName = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Joins runs of single-letter words: 'a m' -> 'am' (for 'A&M' style names).
const mergeSingleLetters = (s) => {
  const out = [];
  let buf = '';
  for (const w of s.split(' ')) {
    if (w.length === 1) buf += w;
    else {
      if (buf) {
        out.push(buf);
        buf = '';
      }
      out.push(w);
    }
  }
  if (buf) out.push(buf);
  return out.join(' ');
};

// Match candidates for a name: normalized, single-letters merged, and
// campus-suffix-stripped variants ('X-Y', 'X, Y', 'X (Y)').
const nameCandidates = (name) => {
  const n = normName(name);
  const cands = [n, mergeSingleLetters(n)];
  for (const sep of [' - ', ' (', ', ']) {
    const i = name.indexOf(sep);
    if (i > 0) {
      const base = normName(name.slice(0, i));
      cands.push(base, mergeSingleLetters(base));
    }
  }
  return [...new Set(cands)];
};

try {
  mkdirSync(dirname(OUT), { recursive: true });

  const needUS = !cacheFresh(OUT);
  const needIntl = !cacheFresh(OUT_INTL);

  // Hipo dataset is needed both for the intl list and for attaching real
  // domains to the US records (IPEDS has no domains).
  let hipoAll = null;
  if (needUS || needIntl) {
    const hipoRes = await fetch(HIPO_URL, { headers: UA });
    if (!hipoRes.ok) throw new Error(`Hipo HTTP ${hipoRes.status}`);
    hipoAll = await hipoRes.json();
  }

  // 1) US institutions with real street addresses (Urban Institute / IPEDS).
  if (!needUS) {
    console.log('[universities] US cache fresh, skipping download');
  } else {
    const res = await fetch(API_URL, { headers: UA });
    if (!res.ok) throw new Error(`IPEDS HTTP ${res.status}`);
    const { results } = await res.json();

    // Real domains from Hipo, matched by normalized institution name.
    const domainByName = new Map();
    for (const u of hipoAll) {
      if (u.alpha_two_code !== 'US' || !u.domains || !u.domains.length) continue;
      const k = normName(u.name);
      if (!domainByName.has(k)) domainByName.set(k, u.domains[0]);
    }

    let withDomain = 0;
    const clean = results
      .filter(
        (r) =>
          r.currently_active_ipeds === 1 &&
          r.institution_level === 4 && // 4-year institutions
          r.address &&
          r.city &&
          r.state_abbr
      )
      .map((r) => {
        const rec = {
          n: r.inst_name, // name
          a: r.address, // street address
          c: r.city,
          s: r.state_abbr, // state
          z: r.zip,
          p: r.phone_number,
        };
        for (const cand of nameCandidates(r.inst_name)) {
          const d = domainByName.get(cand);
          if (d) {
            rec.d = d; // real domain, for emails
            withDomain++;
            break;
          }
        }
        return rec;
      });

    if (clean.length === 0) throw new Error('empty IPEDS result set');
    writeFileSync(OUT, JSON.stringify(clean));
    console.log(`[universities] wrote ${clean.length} US universities (${withDomain} with real domains) -> ${OUT}`);
  }

  // 2) International names + domains (Hipo university-domains-list, MIT).
  //    No street addresses in this source; the generator builds a
  //    plausible address with faker from the country name.
  if (!needIntl) {
    console.log('[universities] intl cache fresh, skipping download');
  } else {
    const clean = hipoAll
      .filter((u) => HIPO_COUNTRIES.includes(u.alpha_two_code) && u.name)
      .map((u) => ({
        n: u.name,
        c: u.country,
        d: (u.domains && u.domains[0]) || null, // primary domain, for emails
      }));

    if (clean.length === 0) throw new Error('empty Hipo result set');
    writeFileSync(OUT_INTL, JSON.stringify(clean));
    console.log(`[universities] wrote ${clean.length} intl universities -> ${OUT_INTL}`);
  }
} catch (err) {
  if (existsSync(OUT)) {
    console.warn(`[universities] download failed (${err.message}); keeping cached file`);
  } else {
    console.error(`[universities] download failed and no cached file exists: ${err.message}`);
    process.exit(1);
  }
}

import universities from '../data/universities.json' with { type: 'json' };
import universitiesIntl from '../data/universities_intl.json' with { type: 'json' };

// Real university data, refreshed at build time (see scripts/fetch-universities.mjs):
//  - US pool (Urban Institute / IPEDS): { n, a, c, s, z, p } with real street
//    addresses; `d` holds a real domain when Hipo name-matching found one.
//  - Intl pool (Hipo university-domains-list): { n, c, d } names + domains only;
//    the address is composed with faker from the country name.
// Normalized shape: { name, street|null, city|null, state|null, zip|null, country, domain|null }.
export const ALL_UNIVERSITIES = [
  ...(Array.isArray(universities)
    ? universities.map((u) => ({
        name: u.n,
        street: u.a,
        city: u.c,
        state: u.s,
        zip: u.z,
        country: 'United States',
        domain: u.d || null,
      }))
    : []),
  ...(Array.isArray(universitiesIntl)
    ? universitiesIntl.map((u) => ({
        name: u.n,
        street: null,
        city: null,
        state: null,
        zip: null,
        country: u.c,
        domain: u.d,
      }))
    : []),
];

export const pickUniversity = () =>
  ALL_UNIVERSITIES.length > 0
    ? ALL_UNIVERSITIES[Math.floor(Math.random() * ALL_UNIVERSITIES.length)]
    : null;

export const formatUniversityAddress = (u, faker) =>
  u.street
    ? `${u.street}, ${u.city}, ${u.state} ${u.zip}`
    : `${faker.location.streetAddress()}, ${faker.location.city()}, ${u.country}`;

// Short abbreviation derived from the institution's initials, e.g.
// "Arizona State University" -> "ASU". Used for employee IDs and monograms.
export const universityAbbr = (name) =>
  name
    .split(/\s+/)
    .map((w) => (w[0] || '').toUpperCase())
    .join('')
    .replace(/[^A-Z]/g, '')
    .slice(0, 4) || 'UNIV';

// Email helpers: real domains when the dataset has them, otherwise a
// plausible .edu derived from the institution name. Names are
// de-accented so 'José García' becomes 'jose.garcia@...'.
export const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const resolveDomain = (u) => u.domain || `${slugify(u.name) || 'university'}.edu`;

export const emailFor = (firstName, lastName, domain) =>
  `${slugify(firstName)}.${slugify(lastName)}@${domain}`;

const normQuery = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Ranked search over the university pool for the autocomplete picker.
// "uned" matches Universidad Nacional de Educación a Distancia via its
// domain (uned.es) and its abbreviation (UNED).
export const searchUniversities = (query, limit = 8) => {
  const q = normQuery(query);
  if (!q) return [];
  const scored = [];
  for (const u of ALL_UNIVERSITIES) {
    const name = normQuery(u.name);
    const dom = (u.domain || '').toLowerCase();
    const abbr = universityAbbr(u.name).toLowerCase();
    let score = -1;
    if (abbr === q || dom === q) score = 0;
    else if (dom.startsWith(q)) score = 1;
    else if (name.startsWith(q)) score = 2;
    else if (name.includes(q)) score = 3;
    else if (dom.includes(q)) score = 4;
    if (score >= 0) scored.push([score, u]);
  }
  scored.sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name));
  return scored.slice(0, limit).map(([, u]) => u);
};

export const findUniversityByName = (name) => {
  const q = normQuery(name);
  return ALL_UNIVERSITIES.find((u) => normQuery(u.name) === q) || null;
};

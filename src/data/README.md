# University data

`universities.json` (US) and `universities_intl.json` (Spain, Nigeria, Japan,
UK, Canada, Mexico) contain real higher-education institutions used by the
document generator (names + addresses instead of fictional placeholders).

- **US source:** Urban Institute Education Data API, IPEDS directory endpoint
  (`https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2022/`)
- **US filter:** currently active, 4-year institutions with a street address
  (~2,845 records).
- **US fields per record:** `n` name, `a` street address, `c` city, `s` state,
  `z` ZIP, `p` phone, `d` real domain when Hipo name-matching found one
  (~35% of records; the generator derives a plausible `.edu` otherwise).
- **Intl source:** Hipo `university-domains-list` (MIT license,
  `https://github.com/Hipo/university-domains-list`) — worldwide names and
  domains, no street addresses.
- **Intl fields per record:** `n` name, `c` country, `d` primary domain (used
  for emails; addresses are composed with faker from the country name).
- **Refresh:** `node scripts/fetch-universities.mjs` (runs automatically as
  part of `npm run build`; skips the download when the files are newer than 30
  days, `--force` to refresh anyway). The generator falls back to fictional
  data if the files are missing or empty, so builds never break on network
  issues.

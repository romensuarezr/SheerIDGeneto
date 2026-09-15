import universities from '../data/universities.json' with { type: 'json' };
import universitiesIntl from '../data/universities_intl.json' with { type: 'json' };

// Real university data, refreshed at build time (see scripts/fetch-universities.mjs):
//  - US pool (Urban Institute / IPEDS): { n, a, c, s, z, p } with real street
//    addresses; `d` holds a real domain when Hipo name-matching found one.
//  - Intl pool (Hipo university-domains-list): { n, c, d } names + domains only.
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

// Verified rectorado/main-campus addresses for Spanish universities
// (checked against official university sites 2026-09-15), keyed by domain.
// Hipo carries no address data, so without this the intl pool would get a
// fully invented faker address (wrong street AND wrong city).
const KNOWN_ADDRESSES = {
  'uned.es': 'Calle Bravo Murillo, 38, 28015 Madrid, España',
  'ucm.es': 'Avenida de Séneca, 2, 28040 Madrid, España',
  'uam.es': 'Calle Einstein, 3, 28049 Madrid, España',
  'ub.es': 'Gran Via de les Corts Catalanes, 585, 08007 Barcelona, España',
  'uab.es': 'Plaça Acadèmica, Edifici A, 08193 Bellaterra (Cerdanyola del Vallès), Barcelona, España',
  'upm.es': 'Calle Ramiro de Maeztu, 7, 28040 Madrid, España',
  'upc.edu': 'Carrer de Jordi Girona, 31, 08034 Barcelona, España',
  'upf.es': 'Carrer de la Mercè, 12, 08002 Barcelona, España',
  'uc3m.es': 'Calle Madrid, 126, 28903 Getafe (Madrid), España',
  'ugr.es': 'Avenida del Hospicio, s/n, 18071 Granada, España',
  'usal.es': 'Patio de Escuelas, 1, 37008 Salamanca, España',
  'usc.es': 'Praza do Obradoiro, s/n, 15782 Santiago de Compostela (A Coruña), España',
  'uv.es': 'Avenida Blasco Ibáñez, 13, 46010 València, España',
  'upv.es': 'Camino de Vera, s/n, 46022 València, España',
  'uva.es': 'Plaza de Santa Cruz, 8, 47002 Valladolid, España',
  'us.es': 'Calle San Fernando, 4, 41004 Sevilla, España',
  'um.es': 'Avenida Teniente Flomesta, 5, 30003 Murcia, España',
  'ehu.es': 'Sarriena, s/n, 48940 Leioa (Bizkaia), España',
  'uniovi.es': 'Calle San Francisco, 3, 33003 Oviedo, España',
  'unican.es': 'Avenida de los Castros, 54, 39005 Santander (Cantabria), España',
  'unirioja.es': 'Avenida de la Paz, 93-103, 26006 Logroño (La Rioja), España',
  'unavarra.es': 'Edificio Rectorado, Campus de Arrosadia, 31006 Pamplona (Navarra), España',
  'ua.es': 'Carretera de San Vicente del Raspeig, s/n, 03690 San Vicente del Raspeig (Alicante), España',
  'ualm.es': 'Carretera de Sacramento, s/n, 04120 La Cañada de San Urbano (Almería), España',
  'ubu.es': 'Hospital del Rey, s/n, 09001 Burgos, España',
  'uah.es': 'Plaza de San Diego, s/n, 28801 Alcalá de Henares (Madrid), España',
  'ujaen.es': 'Campus Las Lagunillas, s/n, 23071 Jaén, España',
  'unileon.es': 'Avenida de la Facultad, 25, 24004 León, España',
  'urjc.es': 'Calle Tulipán, s/n, 28933 Móstoles (Madrid), España',
  'uvigo.gal': 'Edificio Exeria, As Lagoas, Marcosende, 36310 Vigo (Pontevedra), España',
  'udc.gal': 'Rúa da Maestranza, 9, 15001 A Coruña, España',
  'uib.es': 'Carretera de Valldemossa, km 7,5, 07122 Palma (Illes Balears), España',
  'ull.es': 'Calle Padre Herrera, s/n, 38200 San Cristóbal de La Laguna (Santa Cruz de Tenerife), España',
  'ulpgc.es': 'Calle Juan de Quesada, 30, 35001 Las Palmas de Gran Canaria, España',
  'udl.es': 'Plaça de Víctor Siurana, 1, 25003 Lleida, España',
  'udg.es': 'Plaça de Sant Domènec, 3, 17004 Girona, España',
  'urv.es': "Carrer de l'Escorxador, s/n, 43003 Tarragona, España",
  'uji.es': 'Avenida de Vicent Sos Baynat, s/n, 12071 Castelló de la Plana, España',
  'upo.es': 'Carretera de Utrera, km 1, 41013 Sevilla, España',
  'umh.es': 'Avenida de la Universidad, s/n, 03202 Elche (Alicante), España',
  'upct.es': 'Plaza del Cronista Isidoro Valverde, s/n, 30202 Cartagena (Murcia), España',
  'unizar.es': 'Plaza de Basilio Paraíso, 4, 50005 Zaragoza, España',
  'uma.es': 'Avenida de Cervantes, 2, 29071 Málaga, España',
  'unex.es': 'Avenida de Elvas, s/n, 06006 Badajoz, España',
  'uclm.es': 'Calle Altagracia, 50, 13071 Ciudad Real, España',
  'uco.es': 'Avenida Medina Azahara, 5, 14071 Córdoba, España',
  'uhu.es': 'Calle Dr. Cantero Cuadrado, 6, 21071 Huelva, España',
  'uca.es': 'Calle Ancha, 16, 11001 Cádiz, España',
  'uia.es': 'Calle Américo Vespucio, 2, 41092 Sevilla, España',
  'uimp.es': 'Calle Isaac Peral, 23, 28040 Madrid, España',
  'upsa.es': 'Calle Compañía, 5, 37002 Salamanca, España',
  'deusto.es': 'Avenida de las Universidades, 24, 48007 Bilbao, España',
  'upco.es': 'Calle Alberto Aguilera, 23, 28015 Madrid, España',
  'ufv.es': 'Carretera Pozuelo-Majadahonda, km 1,8, 28223 Pozuelo de Alarcón (Madrid), España',
  'unnet.es': 'Calle Santa Cruz de Marcenado, 27, 28015 Madrid, España',
  'uax.es': 'Avenida de la Universidad, 1, 28691 Villanueva de la Cañada (Madrid), España',
  'uloyola.es': 'Avenida de las Universidades, s/n, 41704 Dos Hermanas (Sevilla), España',
  'ucam.edu': 'Avenida de los Jerónimos, 135, 30107 Guadalupe (Murcia), España',
  'ucv.es': 'Calle Quevedo, 2, 46002 Valencia, España',
  'ceu.es': 'Calle Isaac Peral, 58, 28040 Madrid, España',
  'uem.es': 'Calle Tajo, s/n, 28670 Villaviciosa de Odón (Madrid), España',
  'url.es': 'Carrer de Claravall, 1-3, 08022 Barcelona, España',
  'uoc.es': 'Rambla del Poblenou, 154-156, 08018 Barcelona, España',
  'muni.es': 'Calle Loramendi, 4, 20500 Arrasate/Mondragón (Gipuzkoa), España',
  'uic.es': 'Calle Inmaculada, 22, 08017 Barcelona, España',
  'uchceu.es': 'Calle Luis Vives, 1, 46115 Alfara del Patriarca (Valencia), España',
  'ucavila.es': 'Calle de los Canteros, s/n, 05005 Ávila, España',
  'ie.edu': 'Calle Cardenal Zúñiga, 12, 40003 Segovia, España',
  'uvic.es': 'Calle del Doctor Junyent, 1, 08500 Vic (Barcelona), España',
  'unav.es': 'Campus Universitario, s/n, Edificio Central, 31080 Pamplona (Navarra), España',
  'ui1.es': 'Calle Fernán González, 76, 09003 Burgos, España',
  'usj.es': 'Autovía A-23 Zaragoza-Huesca, km 299, 50830 Villanueva de Gállego (Zaragoza), España',
  'villanueva.edu': 'Calle de la Costa Brava, 2, 28034 Madrid, España',
  'esic.es': 'Camino de Valdenigrales, s/n, 28223 Pozuelo de Alarcón (Madrid), España',
  'hesperides.edu.es': 'Calle de Los Balcones, 10, 35001 Las Palmas de Gran Canaria, España',
  'uneatlantico.es': 'Calle Isabel Torres, 21, 39011 Santander (Cantabria), España',
};

export const formatUniversityAddress = (u, faker) =>
  (u.domain && KNOWN_ADDRESSES[u.domain]) ||
  (u.street
    ? `${u.street}, ${u.city}, ${u.state} ${u.zip}`
    : `${faker.location.streetAddress()}, ${faker.location.city()}, ${u.country}`);

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

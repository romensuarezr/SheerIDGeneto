import { fakerES, fakerEN } from '@faker-js/faker';
import { translations } from '../i18n/translations.js';
import {
  pickUniversity,
  formatUniversityAddress,
  universityAbbr,
  resolveDomain,
  emailFor,
} from './universities.js';

const fakerFor = (lang) => (lang === 'es' ? fakerES : fakerEN);
const dataFor = (lang) => (translations[lang] ? translations[lang].data : translations.en.data);
const localeTagFor = (lang) => (lang === 'es' ? 'es-ES' : 'en-US');

export const generateRandomData = (lang = 'en') => {
  const faker = fakerFor(lang);
  const D = dataFor(lang);
  const tag = localeTagFor(lang);

  // Coherent academic timeline, anchored to the current year.
  // Current term = most recent of September / February.
  const now = new Date();
  const curYear = now.getFullYear();
  const termStart = new Date(curYear, now.getMonth() >= 7 ? 8 : 1, 1);

  // Admission: random term start within the current year (Feb or Sep), day 1-10
  const admissionDate = new Date(curYear, faker.helpers.arrayElement([1, 8]), faker.number.int({ min: 1, max: 10 }));

  // Statement: random day within the first 3 weeks of the current term
  const statementDate = new Date(termStart);
  statementDate.setDate(faker.number.int({ min: 1, max: 21 }));
  // Due date is 30-45 days after statement
  const dueDate = new Date(statementDate);
  dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 30, max: 45 }));

  // Issue date typically current or very recent
  const issueDate = faker.date.recent({ days: 5 });

  const formatDate = (date) => {
    return date.toLocaleDateString(tag, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (amount) => amount.toLocaleString(tag, { style: 'currency', currency: 'USD' });

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  // Real university from build-time data; falls back to the fictional
  // brand when the dataset is unavailable.
  const realUniversity = pickUniversity();
  const university = realUniversity ? realUniversity.name : D.university;

  // Course Data Pool based on Major (localized pools from translations)
  const majors = D.majors;

  const selectedMajor = faker.helpers.arrayElement(majors);

  // Generate random courses logic
  const generateCourses = (majorPrefix) => {
    const commonCourses = D.commonCourses;
    const majorCoursesPool = D.majorCourses;

    // Mix 2-3 major courses with 2-3 common courses for realism
    const numMajor = faker.number.int({ min: 2, max: 3 });
    const numCommon = 5 - numMajor;

    const myMajorCourses = faker.helpers.arrayElements(majorCoursesPool[majorPrefix], numMajor);
    const myCommonCourses = faker.helpers.arrayElements(commonCourses, numCommon);

    const combined = [...myMajorCourses, ...myCommonCourses];

    // Generate Grades and Quality Points
    return combined.map(c => {
        const gradePool = ['A', 'A', 'A', 'A', 'B', 'B']; // Heavily skew towards A and B to ensure passing and realistic "good student" GPA
        const grade = faker.helpers.arrayElement(gradePool);
        let pointsPerHour = 0;
        if(grade === 'A') pointsPerHour = 4;
        else if(grade === 'B') pointsPerHour = 3;
        else if(grade === 'C') pointsPerHour = 2;
        else if(grade === 'D') pointsPerHour = 1;

        return {
            ...c,
            grade: grade,
            qualityPoints: (c.hours * pointsPerHour).toFixed(2),
            hours: c.hours.toFixed(2)
        };
    });
  };

  const termCourses = generateCourses(selectedMajor.prefix);
  const springCourses = generateCourses(selectedMajor.prefix);

  // Calculate GPA logic
  const calculateTermStats = (courses) => {
    const attempted = courses.reduce((acc, c) => acc + parseFloat(c.hours), 0);
    const earned = attempted; // Assuming no Fs
    const qualityPoints = courses.reduce((acc, c) => acc + parseFloat(c.qualityPoints), 0);
    const gpa = (qualityPoints / attempted).toFixed(2);
    return { attempted, earned, qualityPoints, gpa };
  };

  const fallStats = calculateTermStats(termCourses);
  const springStats = calculateTermStats(springCourses);

  // Cumulative (mock previous data + current)
  const prevHours = faker.number.int({ min: 15, max: 60 });
  const prevGpa = faker.number.float({ min: 3.2, max: 4.0 }); // Ensure previous GPA is solid (above 3.2)
  const prevPoints = prevHours * prevGpa;

  const cumAttempted = prevHours + fallStats.attempted + springStats.attempted;
  const cumPoints = prevPoints + fallStats.qualityPoints + springStats.qualityPoints;
  const cumGpa = (cumPoints / cumAttempted).toFixed(2);

  // Tuition Data Logic
  // Base tuition around 9500, slightly random but rounded to whole number
  const baseTuition = faker.number.int({ min: 9400, max: 9800 });

  // Differential tuition depends on major kind (locale-independent)
  let diffTuition = 0;
  if (selectedMajor.kind === "business") diffTuition = 1100;
  else if (selectedMajor.kind === "science") diffTuition = 975;
  else diffTuition = 850;

  const fees = {
      studentService: 340,
      computerService: 210,
      library: 150,
      medical: 95,
      other: 680,
      intlOps: 75,
      insurance: 1650
  };

  const totalFees = Object.values(fees).reduce((a, b) => a + b, 0) + diffTuition;
  const totalCharges = baseTuition + totalFees;

  // (admissionDate is computed above, in the current year)

  // Student Card issued 1-4 weeks after admission
  const cardIssueDate = new Date(admissionDate);
  cardIssueDate.setDate(cardIssueDate.getDate() + faker.number.int({ min: 7, max: 28 }));

  // Valid for 4 years from issue
  const cardValidDate = new Date(cardIssueDate);
  cardValidDate.setFullYear(cardValidDate.getFullYear() + 4);

  // Term labels derived from the computed dates (no hardcoded years)
  const isFallTerm = termStart.getMonth() === 8;
  const termLabel = `${isFallTerm ? D.terms.fall : D.terms.spring} ${curYear}`;
  const nextTermLabel = `${isFallTerm ? D.terms.spring : D.terms.fall} ${isFallTerm ? curYear + 1 : curYear}`;
  const admIsFall = admissionDate.getMonth() === 8;
  const admissionTerm = `${admIsFall ? D.terms.fall : D.terms.spring} ${curYear}`;
  // "September 2026" / "septiembre de 2026" — editable from the sidebar
  const programStart = admissionDate.toLocaleDateString(tag, { month: 'long', year: 'numeric' });

  return {
    universityName: university,
    universityLogo: '/university-logo.png',
    universityDomain: resolveDomain(realUniversity || { name: D.university, domain: null }),
    universityAddress: realUniversity
      ? formatUniversityAddress(realUniversity, faker)
      : `${faker.number.int({min: 100, max: 9999})} University Blvd, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })}, ${faker.location.zipCode()}`,
    studentName: `${lastName} ${firstName}`,
    studentID: `${faker.string.numeric(6)}-${faker.string.numeric(4)}`,
    studentEmail: emailFor(
      firstName,
      lastName,
      resolveDomain(realUniversity || { name: D.university, domain: null })
    ),
    passportNumber: faker.string.alphanumeric(9).toUpperCase(), // Added passport
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`,
    term: termLabel,
    nextTerm: nextTermLabel,
    admissionTerm,
    programStart,
    major: selectedMajor.name,
    program: faker.helpers.arrayElement(selectedMajor.programs),
    college: selectedMajor.college,
    statementDate: formatDate(statementDate),
    dueDate: formatDate(dueDate),
    issueDate: formatDate(issueDate),
    admissionDate: formatDate(admissionDate), // Added admission date
    officials: {
        dean: `${faker.person.lastName()}, ${faker.person.firstName()} (PhD)`,
        registrar: `${faker.person.lastName()}, ${faker.person.firstName()}`
    },
    tuition: {
        base: formatCurrency(baseTuition),
        differential: formatCurrency(diffTuition),
        fees: fees,
        total: formatCurrency(totalCharges)
    },
    courses: {
        current: termCourses,
        next: springCourses
    },
    stats: {
        current: fallStats,
        next: springStats,
        cumulative: {
            attempted: cumAttempted.toFixed(2),
            earned: cumAttempted.toFixed(2),
            qualityPoints: cumPoints.toFixed(2),
            gpa: cumGpa
        }
    },
    // Student Card specific
    cardSubtitle: D.cardSubtitle,
    cardIssueDate: formatDate(cardIssueDate),
    cardValidDate: formatDate(cardValidDate),
    cardNotice: D.cardNotice,
    cardColor: faker.helpers.arrayElement(['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899']),
    studentPhoto: null
  };
};

export const generateTeacherData = (lang = 'en') => {
  const faker = fakerFor(lang);
  const D = dataFor(lang);
  const T = D.teacher;
  const tag = localeTagFor(lang);

  const formatDate = (date) => {
    return date.toLocaleDateString(tag, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const title = faker.helpers.arrayElement(T.titles);

  // University/Institution (proper nouns: same in every language).
  // Real institution from build-time data; falls back to the curated list.
  const realUniversity = pickUniversity();
  const selectedUniversity = realUniversity
    ? {
        name: realUniversity.name,
        city: realUniversity.city || faker.location.city(),
        state: realUniversity.state || faker.location.state({ abbreviated: true }),
        abbr: universityAbbr(realUniversity.name),
        domain: realUniversity.domain,
      }
    : { ...faker.helpers.arrayElement(T.universities), domain: null };

  // Department and subjects (localized)
  const selectedDepartment = faker.helpers.arrayElement(T.departments);

  // Employment details
  const hireDate = faker.date.past({ years: faker.number.int({ min: 1, max: 12 }) });
  const employeeId = `${selectedUniversity.abbr}-${faker.string.numeric(6)}`;

  // Teacher ID Card dates
  const idIssueDate = new Date(hireDate);
  idIssueDate.setDate(idIssueDate.getDate() + faker.number.int({ min: 30, max: 90 }));
  const idValidDate = new Date(idIssueDate);
  idValidDate.setFullYear(idValidDate.getFullYear() + 4);

  // Teaching certificate
  const certificationDate = new Date(hireDate);
  certificationDate.setMonth(certificationDate.getMonth() - faker.number.int({ min: 6, max: 24 }));

  // Salary details (more realistic ranges by position key - locale-independent)
  const positionEntry = faker.helpers.arrayElement(selectedDepartment.positions);
  const position = positionEntry.label;
  let baseSalary;
  switch(positionEntry.key) {
    case "lecturer":
      baseSalary = faker.number.int({ min: 45000, max: 65000 });
      break;
    case "assistant":
      baseSalary = faker.number.int({ min: 65000, max: 85000 });
      break;
    case "associate":
      baseSalary = faker.number.int({ min: 80000, max: 110000 });
      break;
    case "professor":
      baseSalary = faker.number.int({ min: 100000, max: 140000 });
      break;
    case "clinical":
      baseSalary = faker.number.int({ min: 90000, max: 120000 });
      break;
    default:
      baseSalary = faker.number.int({ min: 65000, max: 95000 });
  }

  const payPeriodStart = faker.date.recent({ days: 30 });
  const payPeriodEnd = new Date(payPeriodStart);
  payPeriodEnd.setDate(payPeriodEnd.getDate() + 14);

  // Office and contact details
  const building = faker.helpers.arrayElement(T.buildings);
  const officeNumber = `${faker.number.int({ min: 1, max: 5 })}${faker.string.numeric(2)}`;
  const phoneExt = faker.string.numeric(4);

  return {
    // Basic Info
    universityName: selectedUniversity.name,
    universityCity: selectedUniversity.city,
    universityState: selectedUniversity.state,
    universityAbbr: selectedUniversity.abbr,
    universityLogo: '/university-logo.png',
    universityDomain: resolveDomain(selectedUniversity),
    universityAddress: realUniversity
      ? formatUniversityAddress(realUniversity, faker)
      : `${faker.number.int({min: 100, max: 9999})} University Drive, ${selectedUniversity.city}, ${selectedUniversity.state} ${faker.location.zipCode()}`,
    teacherTitle: title,
    teacherName: `${lastName}, ${firstName}`,
    teacherFirstName: firstName,
    teacherLastName: lastName,
    teacherFullName: `${title} ${firstName} ${lastName}`,
    employeeID: employeeId,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${selectedUniversity.state} ${faker.location.zipCode()}`,

    // Office Info
    office: T.officeFormat.replace('{building}', building).replace('{number}', officeNumber),
    phone: `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)} ext. ${phoneExt}`,
    email: emailFor(firstName, lastName, resolveDomain(selectedUniversity)),

    // Academic Info
    department: selectedDepartment.name,
    college: selectedDepartment.college,
    position: position,
    subjects: selectedDepartment.subjects,

    // Dates
    hireDate: formatDate(hireDate),
    certificationDate: formatDate(certificationDate),
    payPeriodStart: formatDate(payPeriodStart),
    payPeriodEnd: formatDate(payPeriodEnd),

    // Teacher ID Card
    idIssueDate: formatDate(idIssueDate),
    idValidDate: formatDate(idValidDate),
    idCardSubtitle: T.idCardSubtitle,
    idColor: faker.helpers.arrayElement(['#dc2626', '#059669', '#7c3aed', '#d97706', '#0891b2']),

    // Salary info
    baseSalary: baseSalary,
    salaryFormatted: baseSalary.toLocaleString(tag, {style: 'currency', currency: 'USD'}),

    // Officials
    officials: {
      dean: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      hr: `${faker.person.firstName()} ${faker.person.lastName()}`,
      principal: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      provost: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
    },

    teacherPhoto: null
  };
};

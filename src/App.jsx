import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, CardBody, Divider, ScrollShadow, Spacer, Select, SelectItem, Tabs, Tab } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateRandomData, generateTeacherData } from './utils/dataGenerator';
import { formatUniversityAddress, resolveDomain, emailFor } from './utils/universities';
import { fakerES, fakerEN } from '@faker-js/faker';
import { useLanguage } from './i18n/LanguageContext';
import UniversityPicker from './components/UniversityPicker';
import ProgramPicker from './components/ProgramPicker';

import TuitionTemplate from './components/TuitionTemplate';
import TranscriptTemplate from './components/TranscriptTemplate';
import ScheduleTemplate from './components/ScheduleTemplate';
import AdmissionLetterTemplate from './components/AdmissionLetterTemplate';
import EnrollmentCertificateTemplate from './components/EnrollmentCertificateTemplate';
import StudentCardFrontTemplate from './components/StudentCardFrontTemplate';
import StudentCardBackTemplate from './components/StudentCardBackTemplate';
import TeacherIdFrontTemplate from './components/TeacherIdFrontTemplate';
import TeacherIdBackTemplate from './components/TeacherIdBackTemplate';
import TeachingCertificateTemplate from './components/TeachingCertificateTemplate';
import EmploymentLetterTemplate from './components/EmploymentLetterTemplate';
import SalaryStatementTemplate from './components/SalaryStatementTemplate';

const App = () => {
  const { lang, setLang, t, currency, setCurrency } = useLanguage();
  const [formData, setFormData] = useState(() => generateRandomData(lang));

  const [exportMode, setExportMode] = useState("stitched-horizontal"); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(0.55); 
  const [activeCanvas, setActiveCanvas] = useState("main"); // "main" or "extra"
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [includeStudentCard, setIncludeStudentCard] = useState(true);
  const [userMode, setUserMode] = useState("student"); // "student" or "teacher"
  const panStartRef = useRef({ x: 0, y: 0 });

  const tuitionRef = useRef(null);
  const transcriptRef = useRef(null);
  const scheduleRef = useRef(null);
  const admissionRef = useRef(null);
  const enrollmentRef = useRef(null);
  const containerRef = useRef(null);

  // Derive an email from a free-text full name, using the name as displayed
  // ("First [Middle] Last"), so the email always matches the visible name.
  const emailFromFullName = (fullName, domain) => {
    const parts = (fullName || '').replace(/^Dr\.\s*/i, '').split(' ').filter(Boolean);
    if (parts.length < 2 || !domain) return null;
    return emailFor(parts[0], parts[parts.length - 1], domain);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Keep the derived email in sync when the person's name is edited by hand.
      if (name === 'studentName') {
        const derived = emailFromFullName(value, prev.universityDomain);
        if (derived) next.studentEmail = derived;
      } else if (name === 'teacherFullName') {
        const derived = emailFromFullName(value, prev.universityDomain);
        if (derived) next.email = derived;
      }
      return next;
    });
  };

  // Free text in the university picker: keep it, don't touch domain/address.
  const handleUniversityTextChange = (text) => {
    setFormData(prev => ({ ...prev, universityName: text }));
  };

  // Explicit university selection: rewrite name, address, domain and
  // recompute the email with the current person's name. The uploaded logo
  // (if any) is kept: it always wins over Clearbit/monogram.
  const handleUniversitySelect = (u) => {
    const faker = lang === 'es' ? fakerES : fakerEN;
    setFormData(prev => {
      const domain = resolveDomain(u);
      const next = {
        ...prev,
        universityName: u.name,
        universityAddress: formatUniversityAddress(u, faker),
        universityDomain: domain,
      };
      if (userMode === 'student') {
        const derived = emailFromFullName(prev.studentName, domain);
        if (derived) next.studentEmail = derived;
      } else {
        const derived = emailFromFullName(prev.teacherFullName, domain);
        if (derived) next.email = derived;
      }
      return next;
    });
  };

  // Free text in the program picker: keep it, don't touch major/college.
  const handleProgramTextChange = (text) => {
    setFormData(prev => ({ ...prev, program: text }));
  };

  // Explicit program selection: fill program + its major + college together.
  const handleProgramSelect = (item) => {
    setFormData(prev => ({
      ...prev,
      program: item.program,
      major: item.major,
      college: item.college,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, universityLogo: event.target.result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (userMode === "student") {
                setFormData(prev => ({ ...prev, studentPhoto: event.target.result }));
            } else {
                setFormData(prev => ({ ...prev, teacherPhoto: event.target.result }));
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const regenerateData = () => {
    const newData = userMode === "student" ? generateRandomData(lang) : generateTeacherData(lang);
    setFormData(prev => ({
        ...newData,
        universityLogo: prev.universityLogo,
        studentPhoto: prev.studentPhoto || prev.teacherPhoto,
        teacherPhoto: prev.teacherPhoto || prev.studentPhoto
    }));
  };

  const switchMode = (mode) => {
    setUserMode(mode);
    const newData = mode === "student" ? generateRandomData(lang) : generateTeacherData(lang);
    setFormData(prev => ({
        ...newData,
        universityLogo: prev.universityLogo,
        studentPhoto: mode === "student" ? prev.studentPhoto || prev.teacherPhoto : null,
        teacherPhoto: mode === "teacher" ? prev.teacherPhoto || prev.studentPhoto : null
    }));
  };

  // Switching language only re-renders the UI: form data (names, university,
  // amounts) is preserved. Amounts re-format via formatMoney; only the
  // regenerate button creates new random data.
  const handleLanguageChange = (newLang) => {
    if (!newLang || newLang === lang) return;
    setLang(newLang);
  };

  const exportStitched = async (forceHorizontal = false) => {
    if (!containerRef.current) return;
    setIsGenerating(true);
    
    // Add exporting class to reset transforms
    containerRef.current.classList.add('exporting');
    
    const originalStyle = containerRef.current.style.cssText;

    try {
      // Temporarily enforce styles if horizontal mode
      if (forceHorizontal) {
        containerRef.current.style.cssText = `
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 0;
          width: max-content;
          justify-content: flex-start;
          align-items: flex-start;
          position: relative;
          background-color: #ffffff;
        `;
      } else {
        // For grid export, ensuring it captures everything by fitting content
        containerRef.current.style.width = "max-content";
        containerRef.current.style.height = "max-content";
        containerRef.current.style.position = "relative";
        containerRef.current.style.backgroundColor = "#ffffff";
      }

      // Small delay to allow style reflow
      await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay slightly

      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff', 
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains('doc-label'), 
        logging: false,
        // Force no background transparency
        onclone: (document) => {
            const element = document.querySelector('.exporting');
            if (element) {
                element.style.backgroundColor = '#ffffff';
                element.style.backgroundImage = 'none';
                element.style.boxShadow = 'none';
                element.style.backdropFilter = 'none'; // CRITICAL: Remove any frost effect
            }
            // Also ensure all document cards have solid backgrounds
            const cards = document.querySelectorAll('.document-card > div'); // The inner div with shadow
            cards.forEach(card => {
                card.style.boxShadow = 'none';
                card.style.backgroundColor = '#ffffff';
            });
        }
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, `${personToken()}-${lang === "es" ? "Combinado" : "Combined"}.png`);
        setIsGenerating(false);
        
        // Restore styles and remove class
        containerRef.current.classList.remove('exporting');
        containerRef.current.style.cssText = originalStyle;
      });
    } catch (err) {
      console.error(err);
      alert(t('ui.exportFailed'));
      setIsGenerating(false);
      containerRef.current.classList.remove('exporting');
      containerRef.current.style.cssText = originalStyle;
    }
  };

  // Filesystem-safe token for download filenames: drop the "Dr." title,
  // strip diacritics, collapse whitespace to underscores, remove unsafe chars.
  const filenameToken = (value) =>
    (value || '')
      .replace(/^Dr\.\s*/i, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'document';

  // e.g. Romen_Suarez-Miva_Open_University-Student-EN-20260916.zip
  // (appends _WithID when the ID card is included)
  const zipFilename = () => {
    const person = filenameToken(userMode === 'student' ? formData.studentName : formData.teacherFullName);
    const uni = filenameToken(formData.universityName);
    const role = userMode === 'student' ? 'Student' : 'Teacher';
    const langTag = (lang || 'en').toUpperCase();
    const d = new Date();
    const dateTag = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const cardTag = includeStudentCard ? '_WithID' : '';
    return `${person}-${uni}-${role}-${langTag}-${dateTag}${cardTag}.zip`;
  };

  // Person token reused for document files (student name, or teacher name w/o "Dr.")
  const personToken = () =>
    filenameToken(userMode === 'student' ? formData.studentName : formData.teacherFullName);

  // Individual document file: "{Persona}-{Documento}.png", with the document
  // name in the active UI language, e.g. Romen_Suarez-Carta_de_admision.png
  const docFilename = (docKey) =>
    `${personToken()}-${filenameToken(t(`ui.docs.${docKey}`))}.png`;

  const exportZipped = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      
      const capture = async (ref, name) => {
        if (!ref.current) return;
        const canvas = await html2canvas(ref.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true
        });
        return { name, data: canvas.toDataURL('image/png').split(',')[1] };
      };

      let imagesToCapture = [];
      
      if (userMode === "student") {
        imagesToCapture = [
          capture(hiddenTuitionRef, docFilename("tuitionStatement")),
          capture(hiddenTranscriptRef, docFilename("transcript")),
          capture(hiddenScheduleRef, docFilename("courseSchedule")),
          capture(hiddenAdmissionRef, docFilename("admissionLetter")),
          capture(hiddenEnrollmentRef, docFilename("enrollmentCert"))
        ];

        if (includeStudentCard) {
          imagesToCapture.push(
            capture(hiddenCardFrontRef, docFilename("studentIdFront")),
            capture(hiddenCardBackRef, docFilename("studentIdBack"))
          );
        }
      } else {
        imagesToCapture = [
          capture(hiddenTeachingCertRef, docFilename("teachingCertificate")),
          capture(hiddenEmploymentLetterRef, docFilename("employmentLetter")),
          capture(hiddenSalaryStatementRef, docFilename("salaryStatement"))
        ];

        if (includeStudentCard) {
          imagesToCapture.push(
            capture(hiddenTeacherIdFrontRef, docFilename("facultyIdFront")),
            capture(hiddenTeacherIdBackRef, docFilename("facultyIdBack"))
          );
        }
      }

      const images = await Promise.all(imagesToCapture);

      images.forEach(img => {
        if(img) zip.file(img.name, img.data, {base64: true});
      });

      const content = await zip.generateAsync({type:"blob"});
      saveAs(content, zipFilename());
      setIsGenerating(false);

    } catch (err) {
      console.error(err);
      alert(t('ui.exportFailed'));
      setIsGenerating(false);
    }
  };

  // Hidden refs for export (Always mounted, off-screen)
  // Using a separate set of refs for export ensures that canvas scaling/drag transforms
  // do not affect the generated images.
  const hiddenTuitionRef = useRef(null);
  const hiddenTranscriptRef = useRef(null);
  const hiddenScheduleRef = useRef(null);
  const hiddenAdmissionRef = useRef(null);
  const hiddenEnrollmentRef = useRef(null);
  const hiddenCardFrontRef = useRef(null);
  const hiddenCardBackRef = useRef(null);
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);
  
  // Teacher refs
  const hiddenTeacherIdFrontRef = useRef(null);
  const hiddenTeacherIdBackRef = useRef(null);
  const hiddenTeachingCertRef = useRef(null);
  const hiddenEmploymentLetterRef = useRef(null);
  const hiddenSalaryStatementRef = useRef(null);
  const teacherIdFrontRef = useRef(null);
  const teacherIdBackRef = useRef(null);
  const teachingCertRef = useRef(null);

  const exportSingle = async (ref, filename) => {
    if (!ref.current) return;
    setIsGenerating(true);
    try {
        const canvas = await html2canvas(ref.current, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher res
            useCORS: true,
            logging: false
        });
        canvas.toBlob((blob) => {
            saveAs(blob, filename);
            setIsGenerating(false);
        });
    } catch (err) {
        console.error(err);
        alert(t('ui.exportFailed'));
        setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (exportMode === "stitched") {
      exportStitched(false); 
    } else if (exportMode === "stitched-horizontal") {
      exportStitched(true);
    } else {
      exportZipped();
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale(prev => Math.max(0.2, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e) => {
    if (e.target.closest('.document-card')) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Top Toolbar */}
      <div className="h-14 flex-shrink-0 border-b border-divider bg-content1 z-30 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2 mr-2">
          <span className="text-xs text-foreground/60">{t('ui.language')}:</span>
          <Select
            aria-label={t('ui.language')}
            selectedKeys={[lang]}
            onSelectionChange={(keys) => handleLanguageChange(Array.from(keys)[0])}
            size="sm"
            className="w-28"
            disallowEmptySelection
          >
            <SelectItem key="en">English</SelectItem>
            <SelectItem key="es">Español</SelectItem>
          </Select>
        </div>

        <div className="flex items-center gap-2 mr-2">
          <span className="text-xs text-foreground/60">{t('ui.currency')}:</span>
          <Select
            aria-label={t('ui.currency')}
            selectedKeys={[currency]}
            onSelectionChange={(keys) => setCurrency(Array.from(keys)[0])}
            size="sm"
            className="w-28"
            disallowEmptySelection
          >
            <SelectItem key="USD">USD ($)</SelectItem>
            <SelectItem key="EUR">EUR (€)</SelectItem>
            <SelectItem key="GBP">GBP (£)</SelectItem>
          </Select>
        </div>

        <Divider orientation="vertical" className="h-8" />

        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-foreground/60">{t('ui.mode')}</span>
          <div className="flex rounded-lg border border-divider overflow-hidden">
            <button 
              className={`px-3 py-1 text-xs font-medium ${userMode === "student" ? "bg-primary text-white" : "bg-content2 text-foreground/60"}`}
              onClick={() => switchMode("student")}
            >
              {t('ui.student')}
            </button>
            <button 
              className={`px-3 py-1 text-xs font-medium ${userMode === "teacher" ? "bg-primary text-white" : "bg-content2 text-foreground/60"}`}
              onClick={() => switchMode("teacher")}
            >
              {t('ui.teacher')}
            </button>
          </div>
        </div>

        <Divider orientation="vertical" className="h-8" />

        <span className="font-bold text-primary text-sm">{t('ui.stitch')}</span>
        <Button 
          color="primary" 
          variant="flat"
          size="sm"
          onClick={() => exportStitched(false)}
          isLoading={isGenerating}
        >
          {t('ui.grid')}
        </Button>
        <Button 
          color="primary" 
          variant="flat"
          size="sm"
          onClick={() => exportStitched(true)}
          isLoading={isGenerating}
        >
          {t('ui.horizontal')}
        </Button>

        <Divider orientation="vertical" className="h-8" />

        <span className="font-bold text-primary text-sm">{t('ui.zip')}</span>
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input 
            type="checkbox" 
            checked={includeStudentCard} 
            onChange={(e) => setIncludeStudentCard(e.target.checked)}
            className="w-3 h-3 rounded"
          />
          {t('ui.includeIdCard')}
        </label>
        <Button 
          color="success" 
          size="sm"
          onClick={exportZipped}
          isLoading={isGenerating}
        >
          {t('ui.downloadZip')}
        </Button>

        <Divider orientation="vertical" className="h-8" />

        <span className="font-bold text-foreground/60 text-sm">{t('ui.single')}</span>
        {userMode === "student" ? (
          <>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenAdmissionRef, docFilename("admissionLetter"))}
              isLoading={isGenerating}
            >
              {t('ui.admission')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenEnrollmentRef, docFilename("enrollmentCert"))}
              isLoading={isGenerating}
            >
              {t('ui.enrollment')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenCardFrontRef, docFilename("studentIdFront"))}
              isLoading={isGenerating}
            >
              {t('ui.idFront')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenCardBackRef, docFilename("studentIdBack"))}
              isLoading={isGenerating}
            >
              {t('ui.idBack')}
            </Button>
          </>
        ) : (
          <>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenTeachingCertRef, docFilename("teachingCertificate"))}
              isLoading={isGenerating}
            >
              {t('ui.certificate')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenEmploymentLetterRef, docFilename("employmentLetter"))}
              isLoading={isGenerating}
            >
              {t('ui.employment')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenSalaryStatementRef, docFilename("salaryStatement"))}
              isLoading={isGenerating}
            >
              {t('ui.salary')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenTeacherIdFrontRef, docFilename("facultyIdFront"))}
              isLoading={isGenerating}
            >
              {t('ui.idFront')}
            </Button>
            <Button 
              color="default" 
              variant="flat"
              size="sm"
              onClick={() => exportSingle(hiddenTeacherIdBackRef, docFilename("facultyIdBack"))}
              isLoading={isGenerating}
            >
              {t('ui.idBack')}
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Input Data */}
        <div className="w-80 flex-shrink-0 border-r border-divider bg-content1 z-20">
          <ScrollShadow className="h-full p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">{t('ui.inputData')}</h2>
              <Button 
                color="secondary" 
                variant="flat"
                size="sm"
                onClick={regenerateData}
              >
                {t('ui.randomize')}
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Images Section */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-foreground mb-1">{t('ui.universityLogo')}</label>
                  <Button 
                    as="label" 
                    variant="flat" 
                    size="sm" 
                    className="w-full cursor-pointer"
                  >
                    {t('ui.chooseFile')}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </Button>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    {userMode === "student" ? t('ui.studentPhoto') : t('ui.teacherPhoto')}
                  </label>
                  <Button 
                    as="label" 
                    variant="flat" 
                    size="sm" 
                    className="w-full cursor-pointer"
                  >
                    {t('ui.chooseFile')}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </Button>
                </div>
              </div>

              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">{t('ui.universityInfo')}</h3>
              
              <UniversityPicker label={t('ui.universityName')} value={formData.universityName} onSelect={handleUniversitySelect} onTextChange={handleUniversityTextChange} />
              <Input label={t('ui.universityAddress')} name="universityAddress" value={formData.universityAddress} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />

              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">
                {userMode === "student" ? t('ui.studentInfo') : t('ui.teacherInfo')}
              </h3>
              
              {userMode === "student" ? (
                <Input label={t('ui.studentName')} name="studentName" value={formData.studentName} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              ) : (
                <Input label={t('ui.teacherName')} name="teacherFullName" value={formData.teacherFullName} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              )}
              {userMode === "student" ? (
                <Input label={t('ui.studentEmail')} name="studentEmail" value={formData.studentEmail || ''} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              ) : (
                <Input label={t('ui.email')} name="email" value={formData.email || ''} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              )}
              {userMode === "student" ? (
                <>
                  <Input label={t('ui.studentId')} name="studentID" value={formData.studentID} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.address')} name="address" value={formData.address} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  
                  <Divider className="my-1" />
                  <h3 className="text-sm font-semibold text-foreground/70">{t('ui.academicInfo')}</h3>
                  
                  <Input label={t('ui.term')} name="term" value={formData.term} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.major')} name="major" value={formData.major} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <ProgramPicker label={t('ui.program')} value={formData.program} onSelect={handleProgramSelect} onTextChange={handleProgramTextChange} />
                  <Input label={t('ui.college')} name="college" value={formData.college} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                </>
              ) : (
                <>
                  <Input label={t('ui.employeeId')} name="employeeID" value={formData.employeeID} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.address')} name="address" value={formData.address} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  
                  <Divider className="my-1" />
                  <h3 className="text-sm font-semibold text-foreground/70">{t('ui.employmentInfo')}</h3>
                  
                  <Input label={t('ui.department')} name="department" value={formData.department} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.position')} name="position" value={formData.position} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.college')} name="college" value={formData.college} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                  <Input label={t('ui.hireDate')} name="hireDate" value={formData.hireDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
                </>
              )}
              
              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">{t('ui.dates')}</h3>
              
              <Input label={t('ui.statementDate')} name="statementDate" value={formData.statementDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label={t('ui.dueDate')} name="dueDate" value={formData.dueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label={t('ui.issueDate')} name="issueDate" value={formData.issueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              
              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">{t('ui.idCardSection')}</h3>
              
              <Input label={t('ui.cardSubtitle')} name="cardSubtitle" value={formData.cardSubtitle} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label={t('ui.cardIssueDate')} name="cardIssueDate" value={formData.cardIssueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label={t('ui.cardValidUntil')} name="cardValidDate" value={formData.cardValidDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
            </div>
          </ScrollShadow>
        </div>

      {/* Hidden Export Containers - Rendered purely for capture */}
      {/* Positioned way off-screen to ensure no visual interference but valid DOM rendering */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', display: 'flex', flexDirection: 'column' }}>
          {/* Core 3 Docs */}
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <TuitionTemplate ref={hiddenTuitionRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <TranscriptTemplate ref={hiddenTranscriptRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <ScheduleTemplate ref={hiddenScheduleRef} data={formData} />
          </div>
          
          {/* Extra 2 Docs */}
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <AdmissionLetterTemplate ref={hiddenAdmissionRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <EnrollmentCertificateTemplate ref={hiddenEnrollmentRef} data={formData} />
          </div>
          
          {/* Student ID Card */}
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <StudentCardFrontTemplate ref={hiddenCardFrontRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <StudentCardBackTemplate ref={hiddenCardBackRef} data={formData} />
          </div>
          
          {/* Teacher Documents */}
          <div style={{ backgroundColor: '#ffffff', width: '595px', height: '842px' }}>
            <TeachingCertificateTemplate ref={hiddenTeachingCertRef} data={formData} />
          </div>
          <div style={{ backgroundColor: '#ffffff', width: '595px', height: '842px' }}>
            <EmploymentLetterTemplate ref={hiddenEmploymentLetterRef} data={formData} />
          </div>
          <div style={{ backgroundColor: '#ffffff', width: '595px', height: '842px' }}>
            <SalaryStatementTemplate ref={hiddenSalaryStatementRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <TeacherIdFrontTemplate ref={hiddenTeacherIdFrontRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <TeacherIdBackTemplate ref={hiddenTeacherIdBackRef} data={formData} />
          </div>
      </div>

      {/* Main Preview Area - Infinite Canvas Style */}
      <div 
        className="flex-grow overflow-hidden bg-zinc-900 relative cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        
        {/* Canvas Switcher Tabs - Floating at Top */}
        <div className="absolute top-6 z-40">
            <Tabs 
                aria-label={t('ui.canvasSelection')} 
                color="primary" 
                variant="bordered"
                selectedKey={activeCanvas}
                onSelectionChange={setActiveCanvas}
                classNames={{
                    tabList: "bg-zinc-800/80 backdrop-blur-md border border-white/10 p-1 rounded-lg",
                    cursor: "bg-primary",
                    tab: "h-10 px-6 text-sm",
                    tabContent: "group-data-[selected=true]:text-white text-zinc-400 font-medium"
                }}
            >
                <Tab key="main" title={userMode === "student" ? t('ui.tabs.standardStudent') : t('ui.tabs.coreTeacher')} />
                <Tab key="extra" title={userMode === "student" ? t('ui.tabs.extraStudent') : t('ui.tabs.extraTeacher')} />
                <Tab key="card" title={userMode === "student" ? t('ui.tabs.studentCard') : t('ui.tabs.facultyCard')} />
            </Tabs>
        </div>

        {/* Dot Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
                 backgroundImage: 'radial-gradient(#555 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }}
        />
        
        {/* Zoom Controls */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-30">
            <Button isIconOnly color="secondary" variant="flat" onClick={handleZoomOut} aria-label={t('ui.zoomOut')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            </Button>
            <div className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center font-mono text-sm">
                {Math.round(scale * 100)}%
            </div>
            <Button isIconOnly color="secondary" variant="flat" onClick={handleZoomIn} aria-label={t('ui.zoomIn')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Button>
        </div>
        
        {/* Canvas Container - Scaled to fit view */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
            <AnimatePresence mode="wait">
                {activeCanvas === "main" && (
                    <motion.div 
                        key="main-canvas"
                        ref={containerRef} 
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        {userMode === "student" ? (
                            <>
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.tuitionStatement')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <TuitionTemplate ref={tuitionRef} data={formData} />
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.transcript')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <TranscriptTemplate ref={transcriptRef} data={formData} />
                                    </div>
                                </motion.div>

                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.courseSchedule')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <ScheduleTemplate ref={scheduleRef} data={formData} />
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.teachingCertificate')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <TeachingCertificateTemplate ref={teachingCertRef} data={formData} />
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.employmentLetter')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <EmploymentLetterTemplate data={formData} />
                                    </div>
                                </motion.div>

                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.salaryStatement')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <SalaryStatementTemplate data={formData} />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                )}
                {activeCanvas === "extra" && (
                    <motion.div 
                        key="extra-canvas"
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        {userMode === "student" ? (
                            <>
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.admissionLetter')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <AdmissionLetterTemplate ref={admissionRef} data={formData} />
                                    </div>
                                </motion.div>

                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.enrollmentCert')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <EnrollmentCertificateTemplate ref={enrollmentRef} data={formData} />
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center text-foreground/60">
                                    <div className="text-6xl mb-4">📋</div>
                                    <div className="text-lg font-medium mb-2">{t('ui.additionalTeacherDocs')}</div>
                                    <div className="text-sm">{t('ui.comingSoon')}</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                {activeCanvas === "card" && (
                    <motion.div 
                        key="card-canvas"
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        {userMode === "student" ? (
                            <>
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.studentIdFront')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <StudentCardFrontTemplate ref={cardFrontRef} data={formData} />
                                    </div>
                                </motion.div>

                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.studentIdBack')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <StudentCardBackTemplate ref={cardBackRef} data={formData} />
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.facultyIdFront')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <TeacherIdFrontTemplate ref={teacherIdFrontRef} data={formData} />
                                    </div>
                                </motion.div>

                                <motion.div 
                                    drag 
                                    dragMomentum={false}
                                    className="relative group document-card"
                                >
                                    <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">{t('ui.labels.facultyIdBack')}</div>
                                    <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                        <TeacherIdBackTemplate ref={teacherIdBackRef} data={formData} />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
};

export default App;

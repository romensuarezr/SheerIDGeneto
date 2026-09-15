import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const EmploymentLetterTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();
  const localeTag = t('localeTag');

  return (
    <div
      ref={ref}
      style={{
        width: '595px',
        height: '842px',
        backgroundColor: '#ffffff',
        border: '1px solid #ffffff',
        padding: '0',
        margin: '0',
        fontFamily: "Times New Roman, serif",
        color: '#000000',
        fontSize: '12px',
        lineHeight: '1.4',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: '40px 50px',
        boxSizing: 'border-box'
      }}>
        {/* Letterhead */}
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1px solid #000000'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginBottom: '5px', textTransform: 'uppercase' }}>
            {data.universityName}
          </div>
          <div style={{ fontSize: '11px', color: '#000000', marginBottom: '3px' }}>
            {t('doc.employment.hrOffice')}
          </div>
          <div style={{ fontSize: '10px', color: '#000000', marginBottom: '5px' }}>
            {data.universityAddress}
          </div>
          <div style={{ fontSize: '9px', color: '#000000' }}>
            Tel: (555) 123-4500 | Email: hr@{data.universityName?.toLowerCase().replace(/\s+/g, '')}.edu
          </div>
        </div>

        {/* Date and Reference */}
        <div style={{ marginBottom: '20px', fontSize: '10px' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>{t('doc.employment.date')}</strong> {new Date().toLocaleDateString(localeTag, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>{t('doc.employment.referenceNo')}</strong> HR-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>{t('doc.employment.employeeId')}</strong> {data.employeeID}
          </div>
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: '15px', fontSize: '12px' }}>
          {t('doc.employment.toWhom')}
        </div>

        {/* Subject Line */}
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
            {t('doc.employment.title')}
          </div>
        </div>

        {/* Body */}
        <div style={{ marginBottom: '15px', fontSize: '11px' }}>
          {t('doc.employment.body1')
            .replace('{name}', data.teacherFullName)
            .replace('{university}', data.universityName)}
        </div>

        {/* Employment Details */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            {t('doc.employment.detailsTitle')}
          </div>
          <div style={{ border: '1px solid #000000', fontSize: '10px' }}>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.fullName')}</strong> {data.teacherFullName}
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.employeeId')}</strong> {data.employeeID}
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.position')}</strong> {data.position}
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.department')}</strong> {data.department}
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.college')}</strong> {data.college}
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.employment.employmentStatus')}</strong> {t('doc.employment.fullTime')}
            </div>
            <div style={{ padding: '4px' }}>
              <strong>{t('doc.employment.dateOfAppointment')}</strong> {data.hireDate}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <strong>{t('doc.employment.employmentStatus')}</strong> {t('doc.employment.statusLine').replace('{name}', data.teacherFullName)}
        </div>

        <div style={{ marginBottom: '15px', fontSize: '11px' }}>
          {t('doc.employment.verificationNote')}
        </div>

        {/* Closing */}
        <div style={{ marginBottom: '20px', fontSize: '11px' }}>
          <div>{t('doc.employment.respectfully')}</div>
        </div>

        {/* Signature */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            borderBottom: '1px solid #000000',
            width: '150px',
            marginBottom: '6px',
            height: '25px'
          }} />
          <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
            {data.officials?.hr}
          </div>
          <div style={{ fontSize: '10px', marginBottom: '2px' }}>
            {t('doc.employment.directorHr')}
          </div>
          <div style={{ fontSize: '10px' }}>
            {data.universityName}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #000000',
          paddingTop: '8px',
          fontSize: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2px', fontWeight: 'bold' }}>
            {t('doc.employment.title')}
          </div>
          <div>
            {t('doc.employment.footerNote').replace('{ref}', data.employeeID)}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmploymentLetterTemplate;

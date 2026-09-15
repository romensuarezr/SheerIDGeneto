import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const TeachingCertificateTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginBottom: '5px' }}>
            {data.universityName}
          </div>
          <div style={{ fontSize: '12px', color: '#000000', marginBottom: '20px' }}>
            {data.college}
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            {t('doc.teachingCert.title')}
          </div>

          <div style={{
            width: '100px',
            height: '2px',
            backgroundColor: '#dc2626',
            margin: '0 auto'
          }} />
        </div>

        {/* Certificate Content */}
        <div style={{ marginBottom: '20px', fontSize: '11px' }}>
          <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '12px', fontStyle: 'italic' }}>
            {t('doc.teachingCert.certifyLine')}
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '15px',
            borderBottom: '1px solid #dc2626',
            paddingBottom: '5px'
          }}>
            {data.teacherFullName}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '11px' }}>
            {t('doc.teachingCert.body')
              .replace('{department}', data.department)
              .replace('{university}', data.universityName)}
          </div>

          <div style={{ marginBottom: '15px', fontSize: '10px' }}>
            <strong>{t('doc.teachingCert.specialization')}</strong>
            <div style={{ marginTop: '5px', paddingLeft: '15px' }}>
              {data.subjects && data.subjects.slice(0, 2).map((subject, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>• {subject}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px', fontSize: '10px' }}>
            <strong>{t('doc.teachingCert.position')}</strong> {data.position}
          </div>

          <div style={{ marginBottom: '15px', fontSize: '10px' }}>
            {t('doc.teachingCert.standards').replace('{university}', data.universityName)}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '10px' }}>
            <strong>{t('doc.teachingCert.certDate')}</strong> {data.certificationDate}
          </div>
        </div>

        {/* Footer Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #000000',
          fontSize: '9px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              borderBottom: '1px solid #000000',
              width: '120px',
              margin: '0 auto 5px',
              height: '20px'
            }} />
            <div style={{ fontSize: '9px', fontWeight: 'bold' }}>
              {data.officials?.dean || t('doc.teachingCert.deanFallback')}
            </div>
            <div style={{ fontSize: '8px' }}>
              {t('doc.teachingCert.deanOf').replace('{college}', data.college)}
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              borderBottom: '1px solid #000000',
              width: '120px',
              margin: '0 auto 5px',
              height: '20px'
            }} />
            <div style={{ fontSize: '9px', fontWeight: 'bold' }}>
              {data.officials?.principal || t('doc.teachingCert.principalFallback')}
            </div>
            <div style={{ fontSize: '8px' }}>
              {t('doc.teachingCert.principalOf').replace('{university}', data.universityName)}
            </div>
          </div>
        </div>

        {/* Certificate Number */}
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '8px'
        }}>
          {t('doc.teachingCert.certNo')} TC-{data.employeeID}-{new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
});

export default TeachingCertificateTemplate;

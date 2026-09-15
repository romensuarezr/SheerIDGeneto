import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const EnrollmentCertificateTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

  return (
    <div ref={ref} style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
        padding: '50px',
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
            {data.universityLogo ? (
                <img src={data.universityLogo} alt="Logo" style={{
                    width: '70px', height: '70px', marginRight: '20px',
                    objectFit: 'contain', display: 'block'
                }} />
            ) : (
                <div style={{
                    width: '70px', height: '70px', marginRight: '20px',
                    backgroundColor: '#333', borderRadius: '5px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold'
                }}>
                    LOGO
                </div>
            )}
            <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>{data.universityName}</h1>
                <div style={{ fontSize: '14px', color: '#666' }}>{t('doc.enrollment.registrarOffice')}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{data.universityAddress || '123 University Blvd, City, State, 12345'}</div>
            </div>
        </div>

        <div style={{ textAlign: 'center', margin: '50px 0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', letterSpacing: '1px' }}>
                {t('doc.enrollment.title')}
            </h2>
        </div>

        <div style={{ fontSize: '14px', textAlign: 'right', marginBottom: '40px' }}>
            <strong>{t('doc.enrollment.dateIssued')}</strong> {data.issueDate}
        </div>

        {/* Body */}
        <div style={{ fontSize: '16px', lineHeight: '2', textAlign: 'justify', marginBottom: '60px' }}>
            <p style={{ marginBottom: '30px' }}>{t('doc.enrollment.toWhom')}</p>

            <p>
                {t('doc.enrollment.body1')
                    .replace('{name}', data.studentName)
                    .replace('{id}', data.studentID)
                    .replace('{university}', data.universityName)}
            </p>

            <p>
                {t('doc.enrollment.body2')
                    .replace('{program}', data.program)
                    .replace('{major}', data.major)
                    .replace('{college}', data.college)
                    .replace('{term}', data.term)}
            </p>

            <p>
                <strong>{t('doc.enrollment.anticipatedGraduation')}</strong> {t('doc.enrollment.graduationDate')}<br/>
                <strong>{t('doc.enrollment.academicStanding')}</strong> {t('doc.enrollment.goodStanding')}
            </p>

            <p style={{ marginTop: '30px' }}>
                {t('doc.enrollment.body3')}
            </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ borderBottom: '1px solid #333', width: '250px', marginBottom: '10px' }}></div>
                <div style={{ fontWeight: 'bold' }}>{data.officials ? data.officials.registrar : 'Registrar Name'}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{t('doc.enrollment.registrarTitle')}</div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '12px', color: '#888', maxWidth: '200px' }}>
                <em>{t('doc.enrollment.disclaimer')}</em>
            </div>
        </div>
    </div>
  );
});

export default EnrollmentCertificateTemplate;

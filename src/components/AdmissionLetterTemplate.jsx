import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const AdmissionLetterTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

  return (
    <div ref={ref} style={{
        fontFamily: "'Times New Roman', Times, serif",
        lineHeight: 1.8,
        padding: '50px',
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {data.universityLogo ? (
                <img src={data.universityLogo} alt="Logo" style={{
                    width: '80px', height: '80px', margin: '0 auto 15px',
                    objectFit: 'contain', display: 'block'
                }} />
            ) : (
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto 15px',
                    backgroundColor: '#1a365d', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '14px', lineHeight: 1.2
                }}>
                    HU<br/>SEAL
                </div>
            )}
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a365d', margin: '0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {data.universityName}
            </h1>
            <div style={{ fontSize: '16px', color: '#666', marginTop: '5px', fontStyle: 'italic' }}>{t('doc.admission.admissionsOffice')}</div>
        </div>

        <div style={{ textAlign: 'center', margin: '40px 0', borderTop: '2px solid #eee', borderBottom: '2px solid #eee', padding: '20px 0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a365d', margin: 0, letterSpacing: '1px' }}>{t('doc.admission.title')}</h2>
        </div>

        {/* Body */}
        <div style={{ fontSize: '16px', textAlign: 'justify', marginBottom: '40px' }}>
            <p style={{ marginBottom: '20px' }}>
                <strong>{t('doc.admission.date')}</strong> {data.admissionDate || data.issueDate}
            </p>
            <p style={{ marginBottom: '20px' }}>
                <strong>{t('doc.admission.dear').replace('{name}', data.studentName)}</strong>
            </p>
            <p style={{ marginBottom: '20px', textIndent: '2em' }}>
                {t('doc.admission.body1').replace('{university}', data.universityName).replace('{term}', data.term)}
            </p>

            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', margin: '30px 0', borderLeft: '4px solid #1a365d' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', width: '150px', color: '#555' }}>{t('doc.admission.studentId')}</td>
                            <td>{data.studentID}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#555' }}>{t('doc.admission.passportNo')}</td>
                            <td>{data.passportNumber}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#555' }}>{t('doc.admission.email')}</td>
                            <td>{data.studentEmail}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#555' }}>{t('doc.admission.program')}</td>
                            <td>{data.program}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#555' }}>{t('doc.admission.major')}</td>
                            <td>{data.major}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#555' }}>{t('doc.admission.college')}</td>
                            <td>{data.college}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p style={{ marginBottom: '20px', textIndent: '2em' }}>
                {t('doc.admission.body2')}
            </p>
            <p style={{ marginBottom: '20px' }}>
                {t('doc.admission.body3')}
            </p>
        </div>

        {/* Footer / Signature */}
        <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '10px' }}>
                    <img src="" alt="" style={{ height: '40px' }} /> {/* Placeholder for signature image if needed */}
                </div>
                <div style={{ fontWeight: 'bold' }}>{data.officials ? data.officials.dean : 'Dean Name'}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{t('doc.admission.deanOfAdmissions')}</div>
            </div>

            <div style={{
                width: '120px', height: '120px',
                border: '4px solid #bf2d2d', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#bf2d2d', fontWeight: 'bold', fontSize: '14px',
                transform: 'rotate(-15deg)', opacity: 0.8, textAlign: 'center'
            }}>
                {t('doc.admission.officialSeal').split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>{word}{i < arr.length - 1 && <br />}</React.Fragment>
                ))}
            </div>
        </div>
    </div>
  );
});

export default AdmissionLetterTemplate;

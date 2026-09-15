import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const ScheduleTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

  return (
    <div ref={ref} style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        padding: '40px',
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px', // Fixed height to match Transcript
        boxSizing: 'border-box'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#50212f' }}>{data.universityName}</h1>
            <h2 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'normal' }}>{t('doc.schedule.title')}</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ddd' }}>
            <div><strong>{t('doc.schedule.student')}</strong> {data.studentName}</div>
            <div><strong>{t('doc.schedule.studentId')}</strong> {data.studentID}</div>
            <div><strong>{t('doc.schedule.term')}</strong> {data.term}</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.course')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.description')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.credits')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.days')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.time')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.location')}</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.schedule.instructor')}</th>
                </tr>
            </thead>
            <tbody>
                {data.courses && data.courses.current ? data.courses.current.map((course, idx) => (
                    <tr key={idx}>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.code}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{course.hours}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{t('doc.schedule.daysValue')}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>10:00 AM - 10:50 AM</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>DERR 238</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>Williams, D.</td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" style={{ border: '1px solid #ddd', padding: '10px' }}>{t('doc.schedule.noData')}</td></tr>
                )}
            </tbody>
        </table>

        <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '10px' }}>
            {t('doc.schedule.totalCredits')} {data.stats && data.stats.current ? data.stats.current.attempted.toFixed(2) : '0.00'}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#777' }}>
            {t('doc.schedule.footer')} <br />
        </div>
    </div>
  );
});

export default ScheduleTemplate;

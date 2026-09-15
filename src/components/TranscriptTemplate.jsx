import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const TranscriptTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

  const headerRow = (
    <tr>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.transcript.course')}</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.transcript.description')}</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.transcript.grade')}</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.transcript.hours')}</th>
        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>{t('doc.transcript.qualityPts')}</th>
    </tr>
  );

  const courseRows = (courses) => (
    courses ? courses.map((course, idx) => (
        <tr key={idx}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.code}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.name}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.grade}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.hours}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.qualityPoints}</td>
        </tr>
    )) : (
        <tr><td colSpan="5" style={{ border: '1px solid #ddd', padding: '8px' }}>{t('doc.transcript.noData')}</td></tr>
    )
  );

  const termTotals = (stats, gpaLabel) => (
    <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
        <tbody>
            <tr>
                <td style={{ padding: '2px 8px' }}><strong>{t('doc.transcript.termTotals')}</strong></td>
                <td style={{ padding: '2px 8px' }}>{t('doc.transcript.attempted')} {stats.attempted.toFixed(2)}</td>
                <td style={{ padding: '2px 8px' }}>{t('doc.transcript.earned')} {stats.earned.toFixed(2)}</td>
                <td style={{ padding: '2px 8px' }}>{t('doc.transcript.gpaHours')} {stats.attempted.toFixed(2)}</td>
                <td style={{ padding: '2px 8px' }}>{t('doc.transcript.qualityPoints')} {stats.qualityPoints.toFixed(2)}</td>
                <td style={{ padding: '2px 8px' }}><strong>{gpaLabel} {stats.gpa}</strong></td>
            </tr>
        </tbody>
    </table>
  );

  return (
    <div ref={ref} style={{
        fontFamily: "'Times New Roman', Times, serif",
        lineHeight: 1.6,
        padding: '40px',
        color: '#333',
        backgroundColor: 'white',
        width: '800px',
        minHeight: '1000px',
        boxSizing: 'border-box'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#50212f' }}>{data.universityName}</h1>
            <h2 style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'normal' }}>{t('doc.transcript.registrarOffice')}</h2>
            <h3 style={{ margin: '5px 0' }}>{t('doc.transcript.title')}</h3>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.name')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.studentName}</td>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.studentId')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.studentID}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.dateIssued')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.issueDate}</td>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.program')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.program}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.college')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.college}</td>
                        <td style={{ padding: '4px 8px' }}><strong>{t('doc.transcript.major')}</strong></td>
                        <td style={{ padding: '4px 8px' }}>{data.major}</td>
                    </tr>
                </tbody>
            </table>
        </div>

            <div>
            <div style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', padding: '10px', marginTop: '20px' }}>{data.term}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    {headerRow}
                </thead>
                <tbody>
                    {courseRows(data.courses && data.courses.current)}
                </tbody>
            </table>
            {data.stats && data.stats.current && termTotals(data.stats.current, t('doc.transcript.termGpa'))}

            <div style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', padding: '10px', marginTop: '20px' }}>{data.nextTerm}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    {headerRow}
                </thead>
                 <tbody>
                    {courseRows(data.courses && data.courses.next)}
                </tbody>
            </table>
            {data.stats && data.stats.next && termTotals(data.stats.next, t('doc.transcript.termGpa'))}

            <div style={{ marginTop: '25px', borderTop: '2px solid #333', paddingTop: '10px' }}>
                {data.stats && data.stats.cumulative && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <tbody>
                     <tr>
                        <td style={{ padding: '2px 8px' }}><strong>{t('doc.transcript.cumulativeTotals')}</strong></td>
                        <td style={{ padding: '2px 8px' }}>{t('doc.transcript.attempted')} {data.stats.cumulative.attempted}</td>
                        <td style={{ padding: '2px 8px' }}>{t('doc.transcript.earned')} {data.stats.cumulative.earned}</td>
                        <td style={{ padding: '2px 8px' }}>{t('doc.transcript.gpaHours')} {data.stats.cumulative.attempted}</td>
                        <td style={{ padding: '2px 8px' }}>{t('doc.transcript.qualityPoints')} {data.stats.cumulative.qualityPoints}</td>
                        <td style={{ padding: '2px 8px' }}><strong>{t('doc.transcript.cumulativeGpa')} {data.stats.cumulative.gpa}</strong></td>
                    </tr>
                     <tr>
                        <td style={{ padding: '2px 8px' }}><strong>{t('doc.transcript.academicStanding')}</strong></td>
                        <td colSpan="5" style={{ padding: '2px 8px' }}>{t('doc.transcript.goodStanding')}</td>
                    </tr>
                    </tbody>
                </table>
                )}
            </div>
        </div>

        <div style={{ marginTop: '40px', fontStyle: 'italic', fontSize: '12px', color: '#666', textAlign: 'center' }}>
            {t('doc.transcript.endOfTranscript')}
        </div>
    </div>
  );
});

export default TranscriptTemplate;

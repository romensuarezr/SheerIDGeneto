import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const TuitionTemplate = forwardRef(({ data }, ref) => {
  const { t, formatMoney } = useLanguage();
  const fees = (data.tuition && data.tuition.fees) || {
      studentService: 340,
      computerService: 210,
      library: 150,
      medical: 95,
      other: 680,
      intlOps: 75,
      insurance: 1650
  };

  return (
    <div ref={ref} style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: 1.6,
        padding: '40px',
        color: '#212529',
        backgroundColor: 'white',
        width: '800px', // Fixed width
        minHeight: '1000px', // Fixed height to match Transcript
        boxSizing: 'border-box'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #50212f', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="logo-text">
                <h1 style={{ margin: 0, fontSize: '26px', color: '#50212f' }}>{data.universityName}</h1>
                <p style={{ margin: 0, fontSize: '14px' }}>{t('doc.tuition.studentBusinessServices')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <strong>{t('doc.tuition.accountStatement')}</strong><br />
                {t('doc.tuition.statementDate')} {data.statementDate}<br />
                {t('doc.tuition.paymentDueDate')} {data.dueDate}
            </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>{t('doc.tuition.to')}</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.studentName}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}></td>
                        <td style={{ padding: '5px 0' }}>{data.address}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>{t('doc.tuition.studentId')}</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.studentID}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px 0' }}><strong>{t('doc.tuition.term')}</strong></td>
                        <td style={{ padding: '5px 0' }}>{data.term}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ padding: '12px 15px', backgroundColor: '#f2f2f2', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>{t('doc.tuition.description')}</th>
                    <th style={{ padding: '12px 15px', backgroundColor: '#f2f2f2', borderBottom: '2px solid #dee2e6', textAlign: 'right' }}>{t('doc.tuition.amount')}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', width: '70%' }}>{t('doc.tuition.tuitionLine')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(data.tuition ? data.tuition.base : 9555)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.differentialTuition')} {data.college}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(data.tuition ? data.tuition.differential : 975)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.studentService')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.studentService)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.computerService')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.computerService)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.library')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.library)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.medical')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.medical)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.other')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.other)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.intlOps')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.intlOps)}</td>
                </tr>
                <tr>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6' }}>{t('doc.tuition.fees.insurance')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', textAlign: 'right' }}>{formatMoney(fees.insurance)}</td>
                </tr>
            </tbody>
        </table>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6', textAlign: 'right' }}>
            <table style={{ width: '40%', marginLeft: 'auto' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '5px' }}>{t('doc.tuition.totalCharges')}</td>
                        <td style={{ padding: '5px', textAlign: 'right' }}>{formatMoney(data.tuition ? data.tuition.total : 13730)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px' }}>{t('doc.tuition.paymentsCredits').replace('{date}', data.statementDate)}</td>
                        <td style={{ padding: '5px', textAlign: 'right' }}>({formatMoney(data.tuition ? data.tuition.total : 13730)})</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px', fontWeight: 'bold', fontSize: '18px', color: '#50212f' }}>{t('doc.tuition.balanceDue')}</td>
                        <td style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#50212f' }}>{formatMoney(0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style={{ marginTop: '40px', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
            {t('doc.tuition.footer')}
        </div>
    </div>
  );
});

export default TuitionTemplate;

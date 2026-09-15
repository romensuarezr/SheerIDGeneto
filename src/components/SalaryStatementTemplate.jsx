import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const SalaryStatementTemplate = forwardRef(({ data }, ref) => {
  const { t, formatMoney } = useLanguage();

  const grossPay = data.baseSalary / 26; // Bi-weekly gross
  const federalTax = grossPay * 0.22;
  const stateTax = grossPay * 0.06;
  const socialSecurity = grossPay * 0.062;
  const medicare = grossPay * 0.0145;
  const retirement = grossPay * 0.05;
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + retirement;
  const netPay = grossPay - totalDeductions;

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
        fontSize: '11px',
        lineHeight: '1.4',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: '30px 40px',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #000000'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', marginBottom: '3px' }}>
              {data.universityName}
            </div>
            <div style={{ fontSize: '10px', color: '#000000', marginBottom: '2px' }}>
              {t('doc.salary.payrollDept')} | {data.universityAddress}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000', marginTop: '8px' }}>
              {t('doc.salary.title')}
            </div>
            <div style={{ fontSize: '9px', color: '#000000' }}>
              {t('doc.salary.payPeriod')} {data.payPeriodStart} - {data.payPeriodEnd}
            </div>
          </div>
        </div>

        {/* Employee Information */}
        <div style={{
          border: '1px solid #000000',
          padding: '10px',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            {t('doc.salary.employeeInfo')}
          </div>
          <div style={{ fontSize: '9px' }}>
            <div style={{ marginBottom: '3px' }}>
              <strong>{t('doc.salary.name')}</strong> {data.teacherFullName} | <strong>{t('doc.salary.id')}</strong> {data.employeeID}
            </div>
            <div>
              <strong>{t('doc.salary.department')}</strong> {data.department} | <strong>{t('doc.salary.position')}</strong> {data.position}
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {t('doc.salary.earnings')}
          </div>
          <div style={{ border: '1px solid #059669', fontSize: '8px' }}>
            <div style={{ padding: '3px', borderBottom: '1px solid #000000' }}>
              <strong>{t('doc.salary.regularSalary')}</strong> {formatMoney(grossPay)} {t('doc.salary.current')} | {formatMoney(grossPay * 12)} {t('doc.salary.ytd')}
            </div>
            <div style={{ padding: '3px', backgroundColor: '#f0fdf4', fontWeight: 'bold' }}>
              <strong>{t('doc.salary.totalGross')}</strong> {formatMoney(grossPay)}
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {t('doc.salary.deductions')}
          </div>
          <div style={{ border: '1px solid #dc2626', fontSize: '8px' }}>
            <div style={{ padding: '2px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{t('doc.salary.federalTax')}</strong> {formatMoney(federalTax)} | <strong>{t('doc.salary.stateTax')}</strong> {formatMoney(stateTax)}
            </div>
            <div style={{ padding: '2px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{t('doc.salary.socialSecurity')}</strong> {formatMoney(socialSecurity)} | <strong>{t('doc.salary.medicare')}</strong> {formatMoney(medicare)}
            </div>
            <div style={{ padding: '2px', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{t('doc.salary.retirement')}</strong> {formatMoney(retirement)}
            </div>
            <div style={{ padding: '3px', backgroundColor: '#fef2f2', fontWeight: 'bold' }}>
              <strong>{t('doc.salary.totalDeductions')}</strong> {formatMoney(totalDeductions)}
            </div>
          </div>
        </div>

        {/* Net Pay Section */}
        <div style={{
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '8px',
          marginBottom: '15px',
          textAlign: 'center',
          fontSize: '10px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>{t('doc.salary.netPay')}</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatMoney(netPay)}</div>
          <div style={{ fontSize: '8px', opacity: 0.8 }}>{t('doc.salary.toBeDeposited')}</div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #000000',
          paddingTop: '8px',
          fontSize: '8px',
          textAlign: 'center'
        }}>
          <div>
            {t('doc.salary.footer')}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SalaryStatementTemplate;

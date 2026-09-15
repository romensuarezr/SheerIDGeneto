import React, { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import UniversityLogo, { isUploadedLogo } from './UniversityLogo';

const TeacherIdFrontTemplate = forwardRef(({ data }, ref) => {
  const { t } = useLanguage();

  return (
    <div
      ref={ref}
      style={{
        width: '750px',
        height: '480px',
        backgroundColor: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        background: data.idColor || '#dc2626',
        color: 'white',
        padding: '22px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: '22px',
        height: '135px',
        flexShrink: 0
      }}>
        <div style={{
          width: '112px',
          height: '112px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <UniversityLogo
            uploadedLogo={isUploadedLogo(data.universityLogo) ? data.universityLogo : null}
            domain={data.universityDomain}
            name={data.universityName}
            size={97}
            bg="#4a5568"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '33px', fontWeight: 'bold', marginBottom: '3px', lineHeight: 1.2 }}>
            {data.universityName}
          </div>
          <div style={{ fontSize: '18px', opacity: 0.95, lineHeight: 1.3, textTransform: 'uppercase' }}>
            {data.idCardSubtitle}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        padding: '25px 30px',
        display: 'flex',
        gap: '30px',
        background: '#fafafa',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Photo */}
        <div style={{
          width: '140px',
          height: '180px',
          background: '#e0e0e0',
          borderRadius: '9px',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ddd'
        }}>
          {data.teacherPhoto ? (
            <img src={data.teacherPhoto} alt="Teacher" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ color: '#999', fontSize: '16px', textAlign: 'center' }}>
              {t('doc.teacherCard.photo')}<br/>3x4
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '7px 0'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '15px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.75px', marginBottom: '3px' }}>
              {t('doc.teacherCard.name')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#333' }}>
              {data.teacherFullName}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '15px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.75px', marginBottom: '3px' }}>
              {t('doc.teacherCard.employeeId')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#333' }}>
              {data.employeeID}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '15px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.75px', marginBottom: '3px' }}>
              {t('doc.teacherCard.department')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#333' }}>
              {data.department}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '15px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.75px', marginBottom: '3px' }}>
              {t('doc.teacherCard.position')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#333' }}>
              {data.position}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '18px 30px',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e0e0e0',
        height: '90px',
        flexShrink: 0
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', marginBottom: '3px' }}>
            {t('doc.teacherCard.issueDate')}
          </div>
          <div style={{ fontSize: '19px', fontWeight: 500, color: '#333' }}>
            {data.idIssueDate || '—'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', marginBottom: '3px' }}>
            {t('doc.teacherCard.validUntil')}
          </div>
          <div style={{ fontSize: '19px', fontWeight: 500, color: '#333' }}>
            {data.idValidDate || '—'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TeacherIdFrontTemplate;

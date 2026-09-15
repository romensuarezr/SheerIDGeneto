import { useEffect, useState } from 'react';
import { universityAbbr } from '../utils/universities';

// A data:/blob: URL means the user uploaded their own logo via the form.
export const isUploadedLogo = (src) => typeof src === 'string' && /^(data|blob):/.test(src);

// Logo priority: user upload > Clearbit (real logo looked up by domain) >
// monogram with the institution's initials. Clearbit failures fall back
// gracefully to the monogram, so a missing logo never breaks a document.
const UniversityLogo = ({
  uploadedLogo,
  domain,
  name,
  size = 80,
  bg = '#1a365d',
  rounded = '50%',
  style = {},
}) => {
  const [clearbitFailed, setClearbitFailed] = useState(false);

  useEffect(() => {
    setClearbitFailed(false);
  }, [domain]);

  const box = { width: size, height: size, ...style };

  if (uploadedLogo) {
    return (
      <img
        src={uploadedLogo}
        alt="Logo"
        style={{ ...box, objectFit: 'contain', display: 'block' }}
      />
    );
  }

  if (domain && !clearbitFailed) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt="Logo"
        onError={() => setClearbitFailed(true)}
        style={{ ...box, objectFit: 'contain', display: 'block' }}
      />
    );
  }

  const abbr = universityAbbr(name || 'University');
  return (
    <div
      style={{
        ...box,
        backgroundColor: bg,
        borderRadius: rounded,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: typeof size === 'number' ? Math.max(10, Math.round(size * 0.22)) : 14,
        lineHeight: 1.1,
        textAlign: 'center',
        padding: 4,
        boxSizing: 'border-box',
      }}
    >
      {abbr}
    </div>
  );
};

export default UniversityLogo;

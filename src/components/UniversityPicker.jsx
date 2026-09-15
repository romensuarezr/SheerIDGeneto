import { useEffect, useRef, useState } from 'react';
import { Input } from '@heroui/react';
import { searchUniversities } from '../utils/universities';
import { useLanguage } from '../i18n/LanguageContext';

// Autocomplete over the 4,100+ real universities in the bundle.
// Typing "uned" surfaces "Universidad Nacional de Educación a Distancia"
// via its domain (uned.es) and abbreviation (UNED). Free text is kept as-is;
// only an explicit selection rewrites name/address/domain.
const UniversityPicker = ({ value, onSelect, onTextChange, label }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleChange = (text) => {
    onTextChange(text);
    const r = searchUniversities(text);
    setResults(r);
    setHighlight(0);
    setOpen(r.length > 0);
  };

  const choose = (u) => {
    setOpen(false);
    onSelect(u);
  };

  const handleKey = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative">
      <Input
        label={label}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          const r = searchUniversities(value);
          setResults(r);
          setHighlight(0);
          if (r.length > 0) setOpen(true);
        }}
        onKeyDown={handleKey}
        variant="bordered"
        labelPlacement="outside"
        size="sm"
        placeholder={t('ui.searchUniversity')}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-content1 border border-divider rounded-lg shadow-lg">
          {results.map((u, i) => (
            <li
              key={`${u.domain || u.name}-${i}`}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(u);
              }}
              className={`px-3 py-2 cursor-pointer ${
                i === highlight ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-sm font-medium">{u.name}</div>
              <div className="text-xs text-foreground/50">
                {u.country}
                {u.domain ? ` · ${u.domain}` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UniversityPicker;

import { useEffect, useRef, useState } from 'react';
import { Input } from '@heroui/react';
import { translations } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';

const norm = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Real degree programs, grouped under the 5 existing specialties.
// Searching "datos" suggests "Grado en Ciencia de Datos" (Informática);
// selecting one fills program + major + college together.
export const searchPrograms = (query, lang) => {
  const majors = translations[lang]?.data.majors || translations.en.data.majors;
  const all = majors.flatMap((m) =>
    (m.programs || []).map((p) => ({ program: p, major: m.name, college: m.college }))
  );
  const q = norm(query).trim();
  if (!q) return all.slice(0, 8);
  const starts = [];
  const contains = [];
  for (const item of all) {
    const n = norm(item.program);
    if (n.startsWith(q)) starts.push(item);
    else if (n.includes(q)) contains.push(item);
    if (starts.length + contains.length >= 12) break;
  }
  return [...starts, ...contains].slice(0, 8);
};

const ProgramPicker = ({ value, onSelect, onTextChange, label }) => {
  const { lang, t } = useLanguage();
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
    const r = searchPrograms(text, lang);
    setResults(r);
    setHighlight(0);
    setOpen(r.length > 0);
  };

  const choose = (item) => {
    setOpen(false);
    onSelect(item);
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
          const r = searchPrograms(value, lang);
          setResults(r);
          setHighlight(0);
          if (r.length > 0) setOpen(true);
        }}
        onKeyDown={handleKey}
        variant="bordered"
        labelPlacement="outside"
        size="sm"
        placeholder={t('ui.searchProgram')}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-auto bg-content1 border border-divider rounded-lg shadow-lg">
          {results.map((item, i) => (
            <li
              key={`${item.program}-${i}`}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(item);
              }}
              className={`px-3 py-2 cursor-pointer ${
                i === highlight ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-sm font-medium">{item.program}</div>
              <div className="text-xs text-foreground/50">{item.major}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramPicker;

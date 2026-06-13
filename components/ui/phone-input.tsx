'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Country data ─────────────────────────────────────────────────────────────
type Country = { iso: string; dial: string; name: string };

const flag = (iso: string) =>
  [...iso.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('');

// Groups: 'es' → 'europe' → 'world'
const COUNTRIES: (Country & { group: 'es' | 'europe' | 'world' })[] = [
  // ── España ──────────────────────────────────────────────────────────────────
  { iso: 'ES', dial: '+34', name: 'España', group: 'es' },

  // ── Europa ──────────────────────────────────────────────────────────────────
  { iso: 'AL', dial: '+355', name: 'Albania', group: 'europe' },
  { iso: 'AD', dial: '+376', name: 'Andorra', group: 'europe' },
  { iso: 'AT', dial: '+43', name: 'Austria', group: 'europe' },
  { iso: 'BY', dial: '+375', name: 'Bielorrusia', group: 'europe' },
  { iso: 'BE', dial: '+32', name: 'Bélgica', group: 'europe' },
  { iso: 'BA', dial: '+387', name: 'Bosnia y Herzegovina', group: 'europe' },
  { iso: 'BG', dial: '+359', name: 'Bulgaria', group: 'europe' },
  { iso: 'HR', dial: '+385', name: 'Croacia', group: 'europe' },
  { iso: 'CY', dial: '+357', name: 'Chipre', group: 'europe' },
  { iso: 'DK', dial: '+45', name: 'Dinamarca', group: 'europe' },
  { iso: 'SK', dial: '+421', name: 'Eslovaquia', group: 'europe' },
  { iso: 'SI', dial: '+386', name: 'Eslovenia', group: 'europe' },
  { iso: 'EE', dial: '+372', name: 'Estonia', group: 'europe' },
  { iso: 'FI', dial: '+358', name: 'Finlandia', group: 'europe' },
  { iso: 'FR', dial: '+33', name: 'Francia', group: 'europe' },
  { iso: 'GE', dial: '+995', name: 'Georgia', group: 'europe' },
  { iso: 'GR', dial: '+30', name: 'Grecia', group: 'europe' },
  { iso: 'HU', dial: '+36', name: 'Hungría', group: 'europe' },
  { iso: 'IS', dial: '+354', name: 'Islandia', group: 'europe' },
  { iso: 'IE', dial: '+353', name: 'Irlanda', group: 'europe' },
  { iso: 'IT', dial: '+39', name: 'Italia', group: 'europe' },
  { iso: 'XK', dial: '+383', name: 'Kosovo', group: 'europe' },
  { iso: 'LV', dial: '+371', name: 'Letonia', group: 'europe' },
  { iso: 'LI', dial: '+423', name: 'Liechtenstein', group: 'europe' },
  { iso: 'LT', dial: '+370', name: 'Lituania', group: 'europe' },
  { iso: 'LU', dial: '+352', name: 'Luxemburgo', group: 'europe' },
  { iso: 'MT', dial: '+356', name: 'Malta', group: 'europe' },
  { iso: 'MD', dial: '+373', name: 'Moldavia', group: 'europe' },
  { iso: 'MC', dial: '+377', name: 'Mónaco', group: 'europe' },
  { iso: 'ME', dial: '+382', name: 'Montenegro', group: 'europe' },
  { iso: 'MK', dial: '+389', name: 'Macedonia del Norte', group: 'europe' },
  { iso: 'NO', dial: '+47', name: 'Noruega', group: 'europe' },
  { iso: 'NL', dial: '+31', name: 'Países Bajos', group: 'europe' },
  { iso: 'PL', dial: '+48', name: 'Polonia', group: 'europe' },
  { iso: 'PT', dial: '+351', name: 'Portugal', group: 'europe' },
  { iso: 'CZ', dial: '+420', name: 'República Checa', group: 'europe' },
  { iso: 'RO', dial: '+40', name: 'Rumanía', group: 'europe' },
  { iso: 'RU', dial: '+7', name: 'Rusia', group: 'europe' },
  { iso: 'SM', dial: '+378', name: 'San Marino', group: 'europe' },
  { iso: 'RS', dial: '+381', name: 'Serbia', group: 'europe' },
  { iso: 'SE', dial: '+46', name: 'Suecia', group: 'europe' },
  { iso: 'CH', dial: '+41', name: 'Suiza', group: 'europe' },
  { iso: 'TR', dial: '+90', name: 'Turquía', group: 'europe' },
  { iso: 'UA', dial: '+380', name: 'Ucrania', group: 'europe' },
  { iso: 'GB', dial: '+44', name: 'Reino Unido', group: 'europe' },
  { iso: 'VA', dial: '+379', name: 'Vaticano', group: 'europe' },

  // ── Resto del mundo ──────────────────────────────────────────────────────────
  { iso: 'AF', dial: '+93', name: 'Afganistán', group: 'world' },
  { iso: 'ZA', dial: '+27', name: 'Sudáfrica', group: 'world' },
  { iso: 'SA', dial: '+966', name: 'Arabia Saudita', group: 'world' },
  { iso: 'DZ', dial: '+213', name: 'Argelia', group: 'world' },
  { iso: 'AR', dial: '+54', name: 'Argentina', group: 'world' },
  { iso: 'AU', dial: '+61', name: 'Australia', group: 'world' },
  { iso: 'BD', dial: '+880', name: 'Bangladés', group: 'world' },
  { iso: 'BO', dial: '+591', name: 'Bolivia', group: 'world' },
  { iso: 'BR', dial: '+55', name: 'Brasil', group: 'world' },
  { iso: 'CA', dial: '+1', name: 'Canadá', group: 'world' },
  { iso: 'CL', dial: '+56', name: 'Chile', group: 'world' },
  { iso: 'CN', dial: '+86', name: 'China', group: 'world' },
  { iso: 'CO', dial: '+57', name: 'Colombia', group: 'world' },
  { iso: 'CD', dial: '+243', name: 'Congo (RDC)', group: 'world' },
  { iso: 'KR', dial: '+82', name: 'Corea del Sur', group: 'world' },
  { iso: 'KP', dial: '+850', name: 'Corea del Norte', group: 'world' },
  { iso: 'CR', dial: '+506', name: 'Costa Rica', group: 'world' },
  { iso: 'CU', dial: '+53', name: 'Cuba', group: 'world' },
  { iso: 'EC', dial: '+593', name: 'Ecuador', group: 'world' },
  { iso: 'EG', dial: '+20', name: 'Egipto', group: 'world' },
  { iso: 'SV', dial: '+503', name: 'El Salvador', group: 'world' },
  { iso: 'AE', dial: '+971', name: 'Emiratos Árabes Unidos', group: 'world' },
  { iso: 'ET', dial: '+251', name: 'Etiopía', group: 'world' },
  { iso: 'PH', dial: '+63', name: 'Filipinas', group: 'world' },
  { iso: 'GT', dial: '+502', name: 'Guatemala', group: 'world' },
  { iso: 'HN', dial: '+504', name: 'Honduras', group: 'world' },
  { iso: 'HK', dial: '+852', name: 'Hong Kong', group: 'world' },
  { iso: 'IN', dial: '+91', name: 'India', group: 'world' },
  { iso: 'ID', dial: '+62', name: 'Indonesia', group: 'world' },
  { iso: 'IQ', dial: '+964', name: 'Irak', group: 'world' },
  { iso: 'IR', dial: '+98', name: 'Irán', group: 'world' },
  { iso: 'IL', dial: '+972', name: 'Israel', group: 'world' },
  { iso: 'JP', dial: '+81', name: 'Japón', group: 'world' },
  { iso: 'JO', dial: '+962', name: 'Jordania', group: 'world' },
  { iso: 'KZ', dial: '+7', name: 'Kazajistán', group: 'world' },
  { iso: 'KE', dial: '+254', name: 'Kenia', group: 'world' },
  { iso: 'KW', dial: '+965', name: 'Kuwait', group: 'world' },
  { iso: 'LB', dial: '+961', name: 'Líbano', group: 'world' },
  { iso: 'LY', dial: '+218', name: 'Libia', group: 'world' },
  { iso: 'MY', dial: '+60', name: 'Malasia', group: 'world' },
  { iso: 'MX', dial: '+52', name: 'México', group: 'world' },
  { iso: 'MA', dial: '+212', name: 'Marruecos', group: 'world' },
  { iso: 'NZ', dial: '+64', name: 'Nueva Zelanda', group: 'world' },
  { iso: 'NI', dial: '+505', name: 'Nicaragua', group: 'world' },
  { iso: 'NG', dial: '+234', name: 'Nigeria', group: 'world' },
  { iso: 'OM', dial: '+968', name: 'Omán', group: 'world' },
  { iso: 'PK', dial: '+92', name: 'Pakistán', group: 'world' },
  { iso: 'PA', dial: '+507', name: 'Panamá', group: 'world' },
  { iso: 'PY', dial: '+595', name: 'Paraguay', group: 'world' },
  { iso: 'PE', dial: '+51', name: 'Perú', group: 'world' },
  { iso: 'QA', dial: '+974', name: 'Qatar', group: 'world' },
  { iso: 'DO', dial: '+1', name: 'República Dominicana', group: 'world' },
  { iso: 'SG', dial: '+65', name: 'Singapur', group: 'world' },
  { iso: 'SY', dial: '+963', name: 'Siria', group: 'world' },
  { iso: 'TW', dial: '+886', name: 'Taiwán', group: 'world' },
  { iso: 'TZ', dial: '+255', name: 'Tanzania', group: 'world' },
  { iso: 'TH', dial: '+66', name: 'Tailandia', group: 'world' },
  { iso: 'TN', dial: '+216', name: 'Túnez', group: 'world' },
  { iso: 'UY', dial: '+598', name: 'Uruguay', group: 'world' },
  { iso: 'US', dial: '+1', name: 'Estados Unidos', group: 'world' },
  { iso: 'UZ', dial: '+998', name: 'Uzbekistán', group: 'world' },
  { iso: 'VE', dial: '+58', name: 'Venezuela', group: 'world' },
  { iso: 'VN', dial: '+84', name: 'Vietnam', group: 'world' },
  { iso: 'YE', dial: '+967', name: 'Yemen', group: 'world' },
];

const GROUP_LABEL: Record<string, string> = {
  es: 'España',
  europe: 'Europa',
  world: 'Resto del mundo',
};

// ─── Parse a full phone string into country + local ───────────────────────────
function parsePhone(value: string): { country: Country; local: string } {
  const defaultCountry = COUNTRIES[0]; // España
  if (!value) return { country: defaultCountry, local: '' };

  // Sort by dial length desc so "+1809" (DO) matches before "+1" (US/CA)
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  const stripped = value.startsWith('+') ? value : `+${value}`;
  const match = sorted.find((c) => stripped.startsWith(c.dial));

  if (match) {
    return { country: match, local: stripped.slice(match.dial.length).trimStart() };
  }
  return { country: defaultCountry, local: value };
}

// ─── Component ────────────────────────────────────────────────────────────────
interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PhoneInput({ value = '', onChange, placeholder, className, id }: PhoneInputProps) {
  const parsed = parsePhone(value);
  const [selectedCountry, setSelectedCountry] = useState<Country>(parsed.country);
  const [localNumber, setLocalNumber] = useState(parsed.local);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const emit = useCallback(
    (country: Country, local: string) => {
      const clean = local.replace(/\D/g, '');
      onChange(clean ? `${country.dial}${clean}` : '');
    },
    [onChange]
  );

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    setOpen(false);
    emit(c, localNumber);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalNumber(raw);
    emit(selectedCountry, raw);
  };

  // Filter countries
  const q = search.toLowerCase();
  const filtered = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q))
    : COUNTRIES;

  // Group filtered countries
  const groups: Array<{ key: string; items: Country[] }> = [];
  const addGroup = (key: 'es' | 'europe' | 'world') => {
    const items = filtered.filter((c) => c.group === key);
    if (items.length) groups.push({ key, items });
  };
  addGroup('es');
  addGroup('europe');
  addGroup('world');

  return (
    <div className={cn('relative flex', className)} ref={dropdownRef}>
      {/* Country selector button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-10 items-center gap-1.5 rounded-l-md border border-r-0 border-input bg-background px-3',
          'text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'transition-colors shrink-0'
        )}
        aria-label="Seleccionar país"
      >
        <span className="text-base leading-none">{flag(selectedCountry.iso)}</span>
        <span className="text-muted-foreground">{selectedCountry.dial}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {/* Number input */}
      <input
        id={id}
        type="tel"
        inputMode="tel"
        value={localNumber}
        onChange={handleLocalChange}
        placeholder={placeholder ?? '600 000 000'}
        className={cn(
          'flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            'absolute left-0 top-full z-[9999] mt-1 w-72 overflow-hidden',
            'rounded-lg border bg-popover shadow-lg',
          )}
        >
          {/* Search */}
          <div className="flex items-center border-b px-3 py-2 gap-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar país o prefijo..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Country list */}
          <div className="max-h-64 overflow-y-auto">
            {groups.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Sin resultados</p>
            )}
            {groups.map(({ key, items }) => (
              <div key={key}>
                <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                  {GROUP_LABEL[key]}
                </div>
                {items.map((c) => (
                  <button
                    key={`${c.iso}-${c.dial}`}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors text-left',
                      selectedCountry.iso === c.iso && 'bg-muted font-medium'
                    )}
                  >
                    <span className="text-base">{flag(c.iso)}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.dial}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

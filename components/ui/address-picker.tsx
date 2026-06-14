'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AddressResult = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

// ─── Script loader singleton ──────────────────────────────────────────────────
let loaderPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    if ((window as any).google?.maps?.places) { resolve(); return; }
    // Use callback= so Google calls us only after ALL libraries are ready
    (window as any).__googleMapsCallback = resolve;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loaderPromise = null;
      delete (window as any).__googleMapsCallback;
      reject(new Error('Failed to load Google Maps'));
    };
    document.head.appendChild(script);
  });
  return loaderPromise;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: { main_text: string; secondary_text: string };
}

interface AddressPickerProps {
  value: string;
  onChange: (result: AddressResult) => void;
  onRawChange?: (raw: string) => void;
  placeholder?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AddressPicker({ value, onChange, onRawChange, placeholder, className }: AddressPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasKey = !!apiKey;

  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapPreview, setMapPreview] = useState<{ lat: number; lng: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [apiError, setApiError] = useState<string | null>(null);

  const serviceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Google Maps once
  useEffect(() => {
    if (!hasKey) return;
    loadGoogleMaps(apiKey!).then(() => {
      const google = (window as any).google;
      serviceRef.current = new google.maps.places.AutocompleteService();
      setMapsReady(true);
    }).catch(() => {});
  }, [hasKey, apiKey]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchPredictions = useCallback((query: string) => {
    if (!serviceRef.current || query.length < 2) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    serviceRef.current.getPlacePredictions(
      { input: query, types: ['address'], componentRestrictions: { country: 'es' } },
      (results: Prediction[] | null, status: string) => {
        setLoading(false);
        console.log('[AddressPicker] status:', status, 'results:', results?.length ?? 0);
        if (status === 'OK' && results) {
          setApiError(null);
          setPredictions(results);
          setOpen(true);
          setActiveIndex(-1);
        } else {
          setPredictions([]);
          setOpen(false);
          if (status !== 'ZERO_RESULTS') setApiError(status);
        }
      }
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    onRawChange?.(raw);
    if (!hasKey) {
      onChange({ address: raw, city: '', postalCode: '', country: '' });
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(raw), 280);
  };

  const selectPrediction = (prediction: Prediction) => {
    setInputValue(prediction.description);
    setPredictions([]);
    setOpen(false);
    setActiveIndex(-1);

    // Get place details
    const google = (window as any).google;
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
      { placeId: prediction.place_id, fields: ['address_components', 'geometry', 'formatted_address'] },
      (place: any, status: string) => {
        if (status !== 'OK' || !place) return;

        const get = (type: string) =>
          place.address_components?.find((c: any) => c.types.includes(type))?.long_name ?? '';

        const streetNumber = get('street_number');
        const route = get('route');
        const address = streetNumber ? `${route}, ${streetNumber}` : route || place.formatted_address || '';
        const city = get('locality') || get('administrative_area_level_2') || get('administrative_area_level_1');
        const postalCode = get('postal_code');
        const country = get('country');
        const lat: number = place.geometry.location.lat();
        const lng: number = place.geometry.location.lng();

        setMapPreview({ lat, lng });
        onChange({ address, city, postalCode, country, lat, lng, placeId: prediction.place_id });
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !predictions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectPrediction(predictions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const inputClass = cn(
    'flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm',
    'ring-offset-background placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasKey ? 'pl-9 pr-3' : 'px-3',
    className
  );

  return (
    <div className="space-y-2">
      {!hasKey && (
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Google Maps no configurado — añade <code className="mx-1 font-mono font-bold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
        </div>
      )}

      <div className="relative" ref={containerRef}>
        {hasKey && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading
              ? <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              : <MapPin className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        )}
        <input
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? (hasKey ? 'Escribe la dirección para buscar...' : 'Calle y número')}
          className={inputClass}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />

        {/* Custom dropdown */}
        {open && predictions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover shadow-lg">
            {predictions.map((p, i) => (
              <button
                key={p.place_id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); selectPrediction(p); }}
                className={cn(
                  'flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors',
                  i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                )}
              >
                <span className="font-medium">{p.structured_formatting.main_text}</span>
                <span className="text-xs text-muted-foreground">{p.structured_formatting.secondary_text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Static map preview */}
      {hasKey && mapPreview && (
        <div className="overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${mapPreview.lat},${mapPreview.lng}&zoom=16&size=600x200&scale=2&markers=color:red%7C${mapPreview.lat},${mapPreview.lng}&key=${apiKey}`}
            alt="Mapa de la dirección"
            className="w-full object-cover"
            style={{ height: 160 }}
          />
        </div>
      )}

      {hasKey && mapsReady && !mapPreview && !open && !apiError && (
        <p className="text-xs text-muted-foreground">
          Escribe para buscar y selecciona una opción de la lista.
        </p>
      )}
      {apiError && (
        <p className="text-xs text-red-500">
          Error Google Maps: <strong>{apiError}</strong> — abre la consola del navegador para más detalles.
        </p>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
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

// ─── Singleton loader ─────────────────────────────────────────────────────────
let gmapsState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
const gmapsQueue: Array<() => void> = [];

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (gmapsState === 'ready') { resolve(); return; }
    if (gmapsState === 'error') { reject(new Error('Google Maps failed to load')); return; }
    gmapsQueue.push(resolve);
    if (gmapsState === 'loading') return;
    gmapsState = 'loading';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__gmapsReady = () => {
      gmapsState = 'ready';
      gmapsQueue.forEach((cb) => cb());
      gmapsQueue.length = 0;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__gmapsError = () => {
      gmapsState = 'error';
      gmapsQueue.forEach((cb) => cb()); // resolve anyway so callers handle missing google
      gmapsQueue.length = 0;
    };

    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmapsReady&loading=async`;
    s.async = true;
    s.onerror = () => {
      gmapsState = 'error';
      gmapsQueue.forEach((cb) => cb());
      gmapsQueue.length = 0;
    };
    document.head.appendChild(s);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
interface AddressPickerProps {
  value: string;
  onChange: (result: AddressResult) => void;
  onRawChange?: (raw: string) => void;
  placeholder?: string;
  className?: string;
}

export function AddressPicker({ value, onChange, onRawChange, placeholder, className }: AddressPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasKey = !!apiKey;
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapPreview, setMapPreview] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    if (!hasKey || !inputRef.current) return;

    loadGoogleMaps(apiKey).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const google = (window as any).google;
      if (!google?.maps?.places || !inputRef.current) return;

      setMapsReady(true);

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'es' },
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
      });

      // Move pac-container to body so it's never clipped by overflow:hidden parents
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (google.maps as any).event.addListener(autocomplete, 'place_changed', () => {});
      document.querySelectorAll('.pac-container').forEach((el) => {
        document.body.appendChild(el);
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const get = (type: string) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (place.address_components as any[])?.find((c: any) =>
            c.types.includes(type)
          )?.long_name ?? '';

        const streetNumber = get('street_number');
        const route = get('route');
        const address = streetNumber ? `${route}, ${streetNumber}` : route || place.formatted_address || '';
        const city =
          get('locality') ||
          get('administrative_area_level_2') ||
          get('administrative_area_level_1');
        const postalCode = get('postal_code');
        const country = get('country');
        const lat: number = place.geometry.location.lat();
        const lng: number = place.geometry.location.lng();
        const placeId: string = place.place_id;

        setMapPreview({ lat, lng });
        onChange({ address, city, postalCode, country, lat, lng, placeId });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey]);

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
      {/* No API key warning */}
      {!hasKey && (
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Google Maps no configurado — añade <code className="mx-1 font-mono font-bold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en <code className="font-mono">.env.local</code>
        </div>
      )}

      <div className="relative">
        {hasKey && (
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        )}
        <input
          ref={inputRef}
          defaultValue={value}
          placeholder={placeholder ?? (hasKey ? 'Escribe la dirección para buscar...' : 'Calle y número')}
          className={inputClass}
          onChange={(e) => {
            const raw = e.target.value;
            onRawChange?.(raw);
            // Without API: propagate changes immediately
            if (!hasKey) onChange({ address: raw, city: '', postalCode: '', country: '' });
          }}
          autoComplete="off"
        />
      </div>

      {/* Static map preview after a place is selected */}
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

      {/* Helper text when Maps is ready */}
      {hasKey && mapsReady && !mapPreview && (
        <p className="text-xs text-muted-foreground">
          Escribe para buscar y selecciona una opción de la lista.
        </p>
      )}
    </div>
  );
}

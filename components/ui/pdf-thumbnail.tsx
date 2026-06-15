'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';

interface Props {
  url: string;
}

export function PdfThumbnail({ url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Use unpkg CDN for the worker — avoids webpack bundling issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument({ url, disableFontFace: true }).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Fit page into a 200×150 thumbnail
        const rawViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(200 / rawViewport.width, 150 / rawViewport.height);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        if (!cancelled) setState('done');
      } catch (err) {
        console.warn('[PdfThumbnail] render error', err);
        if (!cancelled) setState('error');
      }
    }

    render();
    return () => { cancelled = true; };
  }, [url]);

  if (state === 'error') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {state === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-muted/60" />
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
        style={{ display: state === 'done' ? 'block' : 'none' }}
      />
    </div>
  );
}

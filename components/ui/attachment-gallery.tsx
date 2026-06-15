'use client';

import { useState } from 'react';
import { FileText, FileIcon, X, Download, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PdfThumbnail } from './pdf-thumbnail';

type Attachment = { name: string; url: string; size: number; type: string };

function isImage(a: Attachment) {
  return a.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(a.url);
}

function isPdf(a: Attachment) {
  return a.type === 'application/pdf' || /\.pdf$/i.test(a.url);
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseAttachments(raw: string | null): Attachment[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as Attachment[]; } catch { return []; }
}

// ─── Lightbox (images only) ───────────────────────────────────────────────────
function Lightbox({ items, index, onClose }: { items: Attachment[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);
  const item = items[current];

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(items.length - 1, i + 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="mb-3 flex w-full items-center justify-between gap-4">
          <p className="truncate text-sm text-white/80">{item.name}</p>
          <div className="flex items-center gap-2">
            <a
              href={item.url}
              download={item.name}
              className="rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image content */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.name}
          className="max-h-[75vh] max-w-[85vw] rounded-lg object-contain shadow-2xl"
        />

        {/* Navigation */}
        {items.length > 1 && (
          <>
            <button onClick={prev} disabled={current === 0} className="absolute left-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} disabled={current === items.length - 1} className="absolute right-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {items.length > 1 && (
          <div className="mt-3 flex gap-1.5">
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PDF thumbnail card ───────────────────────────────────────────────────────
function pdfViewUrl(blobUrl: string) {
  // Serve via proxy to force Content-Disposition: inline (Vercel Blob defaults to attachment)
  if (blobUrl.startsWith('data:')) return blobUrl;
  return `/api/blob/view?url=${encodeURIComponent(blobUrl)}`;
}

function PdfCard({ a }: { a: Attachment }) {
  return (
    <a
      href={pdfViewUrl(a.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex aspect-[4/3] flex-col overflow-hidden rounded-xl border bg-muted shadow-sm hover:shadow-md transition-shadow"
      title={a.name}
    >
      {/* Real PDF first-page thumbnail */}
      <div className="relative flex-1 overflow-hidden bg-white">
        <PdfThumbnail url={pdfViewUrl(a.url)} />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 border-t bg-muted px-2 py-1.5">
        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium leading-tight text-foreground">{a.name}</p>
          {!!a.size && <p className="text-[10px] text-muted-foreground">{formatSize(a.size)}</p>}
        </div>
      </div>
    </a>
  );
}

// ─── Generic file card ────────────────────────────────────────────────────────
function FileCard({ a, onClick }: { a: Attachment; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border bg-muted shadow-sm hover:shadow-md transition-shadow px-3"
      title={a.name}
    >
      <FileIcon className="h-10 w-10 text-muted-foreground" />
      <div className="w-full text-center">
        <p className="truncate text-xs text-foreground font-medium leading-tight">{a.name}</p>
        {!!a.size && <p className="mt-0.5 text-[11px] text-muted-foreground">{formatSize(a.size)}</p>}
      </div>
    </button>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export function AttachmentGallery({ raw }: { raw: string | null }) {
  const list = parseAttachments(raw);
  // Lightbox only for images
  const images = list.filter(isImage);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  if (!list.length) return null;

  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {list.map((a, i) => {
          if (isImage(a)) {
            const imgIndex = images.indexOf(a);
            return (
              <button
                key={a.url}
                onClick={() => setLightboxImage(imgIndex)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted shadow-sm hover:shadow-md transition-shadow"
                title={a.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate text-[11px] text-white">{a.name}</p>
                </div>
              </button>
            );
          }

          if (isPdf(a)) {
            return <PdfCard key={a.url} a={a} />;
          }

          return <FileCard key={a.url} a={a} onClick={() => window.open(a.url, '_blank')} />;
        })}
      </div>

      {lightboxImage !== null && (
        <Lightbox items={images} index={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </>
  );
}

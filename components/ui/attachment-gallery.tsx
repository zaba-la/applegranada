'use client';

import { useState } from 'react';
import { FileText, FileIcon, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

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

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  index,
  onClose,
}: {
  items: Attachment[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const item = items[current];

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(items.length - 1, i + 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Stop propagation so clicking the content doesn't close */}
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

        {/* Content */}
        {isImage(item) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.name}
            className="max-h-[75vh] max-w-[85vw] rounded-lg object-contain shadow-2xl"
          />
        ) : isPdf(item) ? (
          <iframe
            src={item.url}
            title={item.name}
            className="h-[75vh] w-[85vw] max-w-4xl rounded-lg bg-white shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-12 shadow-2xl">
            <FileIcon className="h-16 w-16 text-muted-foreground" />
            <p className="text-sm font-medium">{item.name}</p>
            <a
              href={item.url}
              download={item.name}
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-black/80 transition-colors"
            >
              Descargar archivo
            </a>
          </div>
        )}

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              className="absolute left-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={current === items.length - 1}
              className="absolute right-[-48px] top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot indicator */}
        {items.length > 1 && (
          <div className="mt-3 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export function AttachmentGallery({ raw }: { raw: string | null }) {
  const list = parseAttachments(raw);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!list.length) return null;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {list.map((a, i) => {
          if (isImage(a)) {
            return (
              <button
                key={a.url}
                onClick={() => setLightbox(i)}
                className="group relative h-20 w-20 overflow-hidden rounded-lg border bg-muted shadow-sm hover:shadow-md transition-shadow"
                title={a.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.url}
                  alt={a.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            );
          }

          if (isPdf(a)) {
            return (
              <button
                key={a.url}
                onClick={() => setLightbox(i)}
                className="group flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border bg-red-50 shadow-sm hover:shadow-md transition-shadow"
                title={a.name}
              >
                <FileText className="h-7 w-7 text-red-500" />
                <span className="max-w-[72px] truncate px-1 text-[10px] text-red-700 font-medium">
                  {a.name}
                </span>
                {!!a.size && (
                  <span className="text-[9px] text-red-400">{formatSize(a.size)}</span>
                )}
              </button>
            );
          }

          return (
            <button
              key={a.url}
              onClick={() => setLightbox(i)}
              className="group flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border bg-muted shadow-sm hover:shadow-md transition-shadow"
              title={a.name}
            >
              <FileIcon className="h-7 w-7 text-muted-foreground" />
              <span className="max-w-[72px] truncate px-1 text-[10px] text-muted-foreground font-medium">
                {a.name}
              </span>
              {!!a.size && (
                <span className="text-[9px] text-muted-foreground/60">{formatSize(a.size)}</span>
              )}
            </button>
          );
        })}
      </div>

      {lightbox !== null && (
        <Lightbox items={list} index={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

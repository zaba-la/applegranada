'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AttachedFile = {
  id: string;
  file: File;
  preview?: string;
};

const MAX_FILES = 8;
const MAX_SIZE_MB = 10;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

interface FileDropzoneProps {
  files: AttachedFile[];
  onChange: (files: AttachedFile[]) => void;
  accept?: string;
}

export function FileDropzone({ files, onChange, accept = '*' }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid: AttachedFile[] = [];
      for (const file of Array.from(incoming)) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`"${file.name}" supera el límite de ${MAX_SIZE_MB} MB`);
          continue;
        }
        if (files.length + valid.length >= MAX_FILES) {
          alert(`Máximo ${MAX_FILES} archivos`);
          break;
        }
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const preview = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined;
        valid.push({ id, file, preview });
      }
      onChange([...files, ...valid]);
    },
    [files, onChange]
  );

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    onChange(files.filter((f) => f.id !== id));
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <label
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            Arrastra archivos aquí o{' '}
            <span className="text-primary underline underline-offset-2">selecciona</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Máximo {MAX_FILES} archivos · {MAX_SIZE_MB} MB por archivo
          </p>
        </div>
        <input
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(({ id, file, preview }) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt={file.name} className="h-8 w-8 rounded object-cover" />
              ) : (
                <FileIcon type={file.type} />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(id)}
                className="rounded p-1 text-muted-foreground hover:text-destructive"
                aria-label="Quitar archivo"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

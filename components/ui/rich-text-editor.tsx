'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function ToolBtn({
  pressed,
  onPressedChange,
  children,
  'aria-label': ariaLabel,
}: {
  pressed: boolean;
  onPressedChange: () => void;
  children: React.ReactNode;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      onClick={onPressedChange}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={cn(
        'rounded p-1.5 transition-colors',
        pressed
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[160px] px-4 py-3 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1 [&_strong]:font-semibold [&_em]:italic',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
        <ToolBtn
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Encabezado"
        >
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Negrita"
        >
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolBtn
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Lista"
        >
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
      </div>

      <div className="relative">
        {editor.isEmpty && placeholder && (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

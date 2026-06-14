import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
  }

  const results: { name: string; url: string; size: number; type: string }[] = [];

  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: `"${file.name}" supera el límite de 20 MB` }, { status: 400 });
    }

    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`tickets/${Date.now()}-${file.name}`, file, { access: 'public' });
        results.push({ name: file.name, url: blob.url, size: file.size, type: file.type });
      } else {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        results.push({ name: file.name, url: dataUrl, size: file.size, type: file.type });
      }
    } catch (err) {
      console.error('[upload] Error subiendo archivo:', file.name, err);
      return NextResponse.json(
        { error: `Error al subir "${file.name}". Verifica que Vercel Blob esté configurado.` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ files: results });
}

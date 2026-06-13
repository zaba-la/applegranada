import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
  }

  const results: { name: string; url: string; size: number; type: string }[] = [];

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: `"${file.name}" supera el límite de 10 MB` }, { status: 400 });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Vercel Blob storage (production)
      const blob = await put(`tickets/${Date.now()}-${file.name}`, file, {
        access: 'public',
      });
      results.push({ name: file.name, url: blob.url, size: file.size, type: file.type });
    } else {
      // Fallback: base64 data URI (dev / no blob configured)
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      results.push({ name: file.name, url: dataUrl, size: file.size, type: file.type });
    }
  }

  return NextResponse.json({ files: results });
}

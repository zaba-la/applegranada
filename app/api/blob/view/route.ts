import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function isSafeBlobUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith('.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('No autorizado', { status: 401 });

  const blobUrl = new URL(req.url).searchParams.get('url') ?? '';

  if (!isSafeBlobUrl(blobUrl)) {
    console.warn('[blob/view] URL rechazada:', blobUrl);
    return new Response('URL no permitida', { status: 400 });
  }

  const upstream = await fetch(blobUrl);
  if (!upstream.ok) {
    console.error('[blob/view] fetch failed:', upstream.status, blobUrl);
    return new Response('Archivo no encontrado', { status: 404 });
  }

  const buffer = await upstream.arrayBuffer();
  const contentType = upstream.headers.get('content-type') ?? 'application/pdf';

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

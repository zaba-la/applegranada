import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BLOB_HOST_PATTERN = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('No autorizado', { status: 401 });

  const blobUrl = new URL(req.url).searchParams.get('url') ?? '';

  if (!BLOB_HOST_PATTERN.test(blobUrl)) {
    return new Response('URL no permitida', { status: 400 });
  }

  const upstream = await fetch(blobUrl);
  if (!upstream.ok) return new Response('Archivo no encontrado', { status: 404 });

  const buffer = await upstream.arrayBuffer();
  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

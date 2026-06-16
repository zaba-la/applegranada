import { NextResponse } from 'next/server';
import { ContactSchema } from '@/lib/schemas';
import { sendEmail, contactFormEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  try {
    await sendEmail(
      'soporte@soportegranada.com',
      `Nuevo mensaje de contacto — ${name}`,
      contactFormEmailHtml({ name, email, phone, message }),
      email
    );
  } catch (err) {
    console.error('[contact] Email no enviado:', err);
    return NextResponse.json({ error: 'No se pudo enviar el mensaje' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

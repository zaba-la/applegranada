import { redirect } from 'next/navigation';

export default function AdminPreciosRedirect({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/admin/servicios`);
}

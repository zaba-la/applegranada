import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  height?: number;
}

const LOGO_ASPECT_RATIO = 1278 / 160;
const LOGO_BLACK_URL =
  'https://res.cloudinary.com/ddagvoaq2/image/upload/v1781593939/soportegranada_2x_qf041o.png';
const LOGO_WHITE_URL =
  'https://res.cloudinary.com/ddagvoaq2/image/upload/v1781593939/soportegranada-blanco_2x_ci0ftm.png';

export function Logo({ className, height = 28 }: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT_RATIO);

  return (
    <>
      <Image
        src={LOGO_BLACK_URL}
        alt="Soporte Granada"
        width={width}
        height={height}
        className={cn('dark:hidden', className)}
      />
      <Image
        src={LOGO_WHITE_URL}
        alt="Soporte Granada"
        width={width}
        height={height}
        className={cn('hidden dark:block', className)}
      />
    </>
  );
}

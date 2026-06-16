import type { IconType } from 'react-icons';
import { SiApple, SiHp, SiTeamviewer } from 'react-icons/si';

interface LogoItem {
  name: string;
  Icon?: IconType;
  src?: string;
}

const logos: LogoItem[] = [
  { name: 'Apple', Icon: SiApple },
  { name: 'Microsoft', src: '/microsoft-mark.svg' },
  { name: 'Adobe', src: '/adobe-mark.svg' },
  { name: 'Google', src: '/google-mark.svg' },
  { name: 'Office 365', src: '/office365-mark.svg' },
  { name: 'Affinity', src: '/affinity-mark.svg' },
  { name: 'HP', Icon: SiHp },
  { name: 'TeamViewer', Icon: SiTeamviewer },
];

const track = [...logos, ...logos];

export function LogoCarousel() {
  return (
    <section className="border-y bg-muted/20 py-10 overflow-hidden">
      <p className="text-center text-sm text-muted-foreground mb-6">
        Trabajamos con las plataformas que ya usas
      </p>
      <div className="animate-logo-scroll flex w-max gap-16">
        {track.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex h-10 w-28 shrink-0 items-center justify-center"
            title={logo.name}
          >
            {logo.Icon ? (
              <logo.Icon className="h-9 w-9 text-foreground" aria-label={logo.name} />
            ) : (
              <img src={logo.src} alt={logo.name} className="h-full w-full object-contain dark:invert" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

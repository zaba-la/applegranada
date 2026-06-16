import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/fade-in';
import { blogPosts } from '@/lib/blog-posts';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

const LINK_PATTERN = /(\[[^\]]+\]\([^)]+\))/g;

function renderRichText(text: string) {
  return text.split(LINK_PATTERN).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    return (
      <a
        key={i}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 text-foreground hover:no-underline"
      >
        {match[1]}
      </a>
    );
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  unstable_setRequestLocale(locale);
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div>
      <FadeIn>
        <div className="relative h-64 md:h-[28rem] w-full overflow-hidden">
          <Image src={post.image} alt="" fill className="object-cover" priority />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      </FadeIn>

      <div className="container mx-auto px-4 pt-10 pb-16">
        <FadeIn>
          <div className="max-w-2xl mx-auto">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al blog
            </Link>

            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">{post.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap gap-1.5 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-muted-foreground space-y-4 mb-12 leading-relaxed">
              {post.content.map((paragraph, i) => (
                <p key={i}>{renderRichText(paragraph)}</p>
              ))}
            </div>

            <div className="rounded-xl bg-muted/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium">¿Necesitas ayuda con esto? Cuéntanos qué pasa y te decimos cómo lo resolvemos.</p>
              <Button asChild>
                <Link href={`/${locale}/contacto`}>
                  Habla con nosotros <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

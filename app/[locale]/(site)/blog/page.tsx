import { unstable_setRequestLocale } from 'next-intl/server';
import { FadeIn } from '@/components/fade-in';
import { BlogList } from '@/components/blog-list';
import { blogPosts } from '@/lib/blog-posts';

export const metadata = {
  title: 'Blog',
  description: 'Consejos prácticos sobre el cuidado de tus dispositivos Apple y Windows. Sin tecnicismos, en cristiano.',
};

const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn>
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Consejos prácticos sobre el cuidado de tus dispositivos Apple y Windows. Sin tecnicismos, en cristiano.
          </p>
        </div>
      </FadeIn>

      <BlogList posts={posts} locale={locale} />
    </div>
  );
}

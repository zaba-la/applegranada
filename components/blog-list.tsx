'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/blog-posts';

export function BlogList({ posts, locale }: { posts: BlogPost[]; locale: string }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const all = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => all.add(tag)));
    return Array.from(all).sort();
  }, [posts]);

  const visiblePosts = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;

  return (
    <>
      <div className="max-w-5xl mx-auto mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            activeTag === null ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          Todos
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeTag === tag ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto grid gap-5 sm:grid-cols-2">
        {visiblePosts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 80}>
            <Link href={`/${locale}/blog/${post.slug}`} className="block group">
              <Card className="transition-shadow hover:shadow-md cursor-pointer overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={post.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:underline underline-offset-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mb-2">{post.description}</CardDescription>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          </FadeIn>
        ))}
        {visiblePosts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hay artículos con esta etiqueta todavía.</p>
        )}
      </div>
    </>
  );
}

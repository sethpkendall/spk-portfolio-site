import Link from "next/link";
import CoverImage from "./cover-image";

function PastGigTile({
    title,
    coverImage,
    excerpt,
    slug,
  }: {
    title: string;
    coverImage: any;
    excerpt: string;
    slug: string;
  }) {
    return (
        <Link href={`/posts/${slug}`}>
            <div className="transition:transform duration-100 hover:scale-105 h-full p-6">
                <div className="mb-5">
                <CoverImage title={title} url={coverImage.url} />
                </div>
                <h3 className="text-3xl mb-3 leading-snug">
                
                    {title}
                </h3>
                <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
            </div>
        </Link>
    );
  }

export default function PastGigs({ morePosts }: { morePosts: any[] }) {
  return (
    <section id="pastGigsParent">
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Past Gigs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-4 md:gap-x-8 lg:gap-x-16 gap-y-20 md:gap-y-32 mb-32">
        {morePosts.map((post) => (
          <PastGigTile
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
}

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
            <div className="transition-all duration-200 hover:scale-[1.02] h-full p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md bg-white">
                <div className="mb-4">
                <CoverImage title={title} url={coverImage.url} />
                </div>
                <h3 className="text-2xl mb-2 leading-snug font-semibold">
                
                    {title}
                </h3>
                <p className="text-base leading-relaxed text-gray-700">{excerpt}</p>
            </div>
        </Link>
    );
  }

export default function PastGigs({ morePosts }: { morePosts: any[] }) {
  return (
    <section id="pastGigsParent">
      <h2 className="mb-6 text-5xl md:text-6xl font-bold tracking-tighter leading-tight border-b-2 border-gray-300 pb-3">
        Past Gigs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
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

import Link from "next/link";
import { draftMode } from "next/headers";

import Date from "./date";
import CoverImage from "./cover-image";
import Avatar from "./avatar";
import PastGigs from "./past-gigs";

import { getAllPosts } from "@/lib/api";

function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: {
  title: string;
  coverImage: any;
  date: string;
  excerpt: string;
  author: any;
  slug: string;
}) {
  return (
    <section className="border-b-2 border-gray-200 pb-12 mb-12 shadow-sm">
      <div className="mb-6 md:mb-10">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-8">
        <div className="border-r-0 md:border-r md:border-gray-200 pr-0 md:pr-8">
          <h3 className="mb-3 text-4xl lg:text-5xl leading-tight font-bold">
            <Link href={`/posts/${slug}`}>
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg text-gray-600">
            <Date dateString={date} />
          </div>
        </div>
        <div className="pl-0 md:pl-4">
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const { isEnabled } = draftMode();
  const allPosts = await getAllPosts(isEnabled);
  const heroPost = allPosts[(allPosts.length - 1)];
  const morePosts = allPosts.slice(0, allPosts.length - 1);

  return (
    <div className="container mx-auto px-5">
      {heroPost && (
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      <PastGigs morePosts={morePosts} />
    </div>
  );
}

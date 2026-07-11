import { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import postService from "../api/postApi";

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        postService.getPublishedPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
    return (
        <div className='w-full bg-white'>
            {/* Full-bleed hero matching Home page pattern */}
            <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/all-posts-bg.png')" }}>
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/15" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-36">
                    <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                        Complete library
                    </p>
                    <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 mx-auto max-w-3xl font-serif text-5xl font-semibold leading-[1.1] text-white md:text-6xl">
                        Every story, in one place.
                    </h1>
                    <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 mx-auto mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                        Dive into our complete collection of articles, essays, and stories — written by a growing community of passionate voices from around the world.
                    </p>
                </div>
            </div>

            <div className="bg-stone-50 py-12">
                <Container>
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {posts.map((post, i) => (
                            <div
                                key={post.$id}
                                className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
                                style={{ animationDelay: `${i * 75}ms` }}
                            >
                                <PostCard {...post} index={i} />
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default AllPosts


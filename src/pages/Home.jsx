import { useEffect, useState } from 'react';
import postService from '../api/postApi'
import { Container, PostCard } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([])
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        postService.getPublishedPosts().then((posts) => {
            if (posts) setPosts(posts.documents)
        })
    }, [])

    const submitSearch = (event) => {
        event.preventDefault()
        navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search")
    }

    // ── Logged-out landing page ──────────────────────────────────────────────
    if (!authStatus) {
        return (
            <div className="w-full bg-white">
                {/* Full-bleed hero */}
                <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/15" />
                    <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                            Stories, insights &amp; inspiration
                        </p>
                        <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 max-w-3xl font-serif text-5xl font-semibold leading-[1.1] text-white md:text-7xl">
                            Discover stories that matter to you.
                        </h1>
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                            Explore thoughtful articles, personal perspectives, and engaging content from writers around the world.
                        </p>
                        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-300 mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/posts"
                                className="rounded-sm bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-950 transition-colors duration-150 hover:bg-stone-100 active:scale-[0.98]"
                            >
                                Start reading
                            </Link>
                            <Link
                                to="/search"
                                className="rounded-sm border border-white/40 bg-transparent px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-white/10 active:scale-[0.98]"
                            >
                                Search library
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-sm px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors duration-150 hover:text-white"
                            >
                                Sign in to save
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature cards */}
                <Container>
                    <div className="py-16">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">Featured stories</p>
                                <h2 className="font-serif text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                                    Start with the latest posts
                                </h2>
                            </div>
                            <Link className="text-sm font-semibold uppercase tracking-widest text-stone-500 transition-colors hover:text-stone-950" to="/posts">
                                View all →
                            </Link>
                        </div>

                        {posts.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.slice(0, 3).map((post, i) => (
                                    <div
                                        key={post.$id}
                                        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
                                        style={{ animationDelay: `${i * 75}ms` }}
                                    >
                                        <PostCard {...post} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-sm border border-dashed border-stone-300 p-10 text-center">
                                <h2 className="font-serif text-2xl font-semibold text-stone-950">Coming soon</h2>
                                <p className="mt-3 text-stone-500">New articles will appear here as writers publish their stories.</p>
                            </div>
                        )}
                    </div>

                    {/* Value prop row */}
                    <div className="grid gap-6 border-t border-stone-200 py-16 md:grid-cols-3">
                        {[
                            ["Read freely",     "Browse and explore content without creating an account."],
                            ["Discover easily", "Search, tags, and author profiles help you find what matters."],
                            ["Join when ready", "Create an account to save favorites and start your own blog."],
                        ].map(([title, copy], i) => (
                            <div
                                key={title}
                                className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 border-l-2 border-stone-200 pl-5"
                                style={{ animationDelay: `${i * 75}ms` }}
                            >
                                <h3 className="font-serif text-xl font-semibold text-stone-950">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-stone-500">{copy}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    // ── Logged-in feed page ──────────────────────────────────────────────────
    return (
        <div className='w-full bg-white pb-16'>
            {/* Hero */}
            <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/10" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
                    <div className="max-w-3xl">
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                            Your creative space
                        </p>
                        <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 font-serif text-5xl font-semibold leading-[1.1] text-white md:text-6xl">
                            Write, share, and connect with readers.
                        </h1>
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 mt-5 text-base leading-7 text-white/75 md:text-lg">
                            Discover inspiring content, save your favorites, and manage your own publishing space. Whether you're here to explore new ideas or share your own stories, you'll find everything you need to build your audience and express yourself through a seamless, distraction-free writing experience.
                        </p>
                    </div>
                </div>
            </div>

            <Container>
                {/* Section header + search */}
                <div className="mt-14 mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">Featured content</p>
                        <h2 className="font-serif text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">Latest writing</h2>
                    </div>
                    <p className="max-w-sm text-sm text-stone-500">Discover and read published articles from our community of writers.</p>
                </div>

                <form onSubmit={submitSearch} className="mb-10 flex gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="min-w-0 flex-1 rounded-sm border border-stone-300 px-4 py-3 text-sm outline-none transition-colors focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                        placeholder="Search posts by title…"
                    />
                    <button
                        type="submit"
                        className="rounded-sm bg-stone-950 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-stone-700 active:scale-[0.98]"
                    >
                        Search
                    </button>
                </form>

                {/* Card grid */}
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {posts.map((post, i) => (
                        <div
                            key={post.$id}
                            className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
                            style={{ animationDelay: `${i * 75}ms` }}
                        >
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home


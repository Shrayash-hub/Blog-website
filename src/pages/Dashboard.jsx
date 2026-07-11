import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import postService from "../api/postApi";
import bookmarkService from "../api/bookmarkApi";
import { Container, PostCard } from "../components";

function Dashboard() {
    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        if (!userData?.$id) return;

        postService.getUserPosts(userData.$id).then((response) => {
            setPosts(response?.documents || []);
        });

        bookmarkService.getBookmarks(userData.$id).then((response) => {
            setBookmarks(response?.documents || []);
        });
    }, [userData?.$id]);

    const stats = useMemo(() => {
        const published = posts.filter((post) => post.status === "active").length;
        const drafts = posts.length - published;

        return [
            { label: "Total posts", value: posts.length },
            { label: "Published", value: published },
            { label: "Drafts", value: drafts },
            { label: "Saved", value: bookmarks.length },
        ];
    }, [posts, bookmarks]);

    const recentPosts = posts.slice(0, 3);

    return (
        <div className="w-full bg-white">
            {/* Full-bleed hero with background image */}
            <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/dashboard-bg.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        {/* Left: Avatar + Text */}
                        <div className="flex flex-1 flex-col gap-5">
                            {/* Label + Avatar row */}
                            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white ring-2 ring-white/20">
                                    {userData?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                                    Dashboard
                                </p>
                            </div>
                            {/* Heading */}
                            <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 font-serif text-4xl font-semibold leading-[1.1] text-white md:text-6xl">
                                Welcome back,<br />{userData?.name || "writer"}
                            </h1>
                            {/* Description */}
                            <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                                Your creative hub — track published posts, review drafts, manage your content, and keep your writing momentum going.
                            </p>
                        </div>
                        {/* Right: New Post CTA */}
                        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-200 shrink-0">
                            <Link
                                to="/dashboard/posts/new"
                                className="inline-flex items-center justify-center rounded bg-white px-7 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-950 transition-colors duration-150 hover:bg-stone-100 active:scale-[0.98]"
                            >
                                New post
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="border-b border-stone-200 bg-stone-50 py-10">
                <Container>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm"
                            >
                                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                    {stat.label}
                                </p>
                                <p className="mt-3 font-serif text-4xl font-semibold text-stone-950">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Content section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                        {/* Recent posts */}
                        <section>
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-serif text-3xl font-semibold text-stone-950">
                                    Recent posts
                                </h2>
                                <Link
                                    to="/dashboard/posts"
                                    className="text-sm font-semibold uppercase tracking-widest text-stone-500 transition-colors hover:text-stone-950"
                                >
                                    Manage all →
                                </Link>
                            </div>
                            {recentPosts.length ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {recentPosts.map((post, i) => (
                                        <div
                                            key={post.$id}
                                            className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
                                            style={{ animationDelay: `${i * 75}ms` }}
                                        >
                                            <PostCard {...post} index={i} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-sm border border-dashed border-stone-300 bg-white p-10 text-center">
                                    <h3 className="font-serif text-2xl font-semibold text-stone-950">
                                        No posts yet
                                    </h3>
                                    <p className="mt-3 text-stone-500">
                                        Create your first article and it will appear here.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Quick actions sidebar */}
                        <aside className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
                            <h2 className="font-serif text-xl font-semibold text-stone-950">
                                Quick actions
                            </h2>
                            <div className="mt-5 flex flex-col gap-3">
                                <Link
                                    className="rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition-all duration-150 hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                                    to="/dashboard/posts/new"
                                >
                                    Write a post
                                </Link>
                                <Link
                                    className="rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition-all duration-150 hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                                    to="/dashboard/profile"
                                >
                                    Edit public profile
                                </Link>
                                <Link
                                    className="rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition-all duration-150 hover:border-stone-950 hover:bg-stone-950 hover:text-white"
                                    to="/dashboard/saved"
                                >
                                    View saved posts
                                </Link>
                            </div>
                        </aside>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Dashboard;


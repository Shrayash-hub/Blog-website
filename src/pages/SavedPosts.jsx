import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import bookmarkService from "../api/bookmarkApi";
import postService from "../api/postApi";
import { Container, PostCard } from "../components";

function SavedPosts() {
    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!userData?.$id) return;

        bookmarkService.getBookmarks(userData.$id).then((response) => {
            setPosts(response?.documents || []);
        });
    }, [userData?.$id]);

    return (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Hero section */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                            Personal library
                        </p>
                        <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                            Saved posts
                        </h1>
                        <p className="mt-5 text-base leading-7 text-stone-600">
                            A personal reading queue for articles worth returning to.
                        </p>
                    </div>
                </Container>
            </div>

            {/* Posts grid */}
            <div className="bg-stone-50 py-12">
                <Container>
                    {posts.length ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    ) : (
                        <div className="rounded-sm border border-dashed border-stone-300 bg-white p-10 text-center">
                            <h2 className="font-serif text-2xl font-semibold text-stone-950">Nothing saved yet</h2>
                            <p className="mt-3 text-stone-500">Bookmark posts from article pages and they will appear here.</p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default SavedPosts;

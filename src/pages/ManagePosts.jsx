import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import postService from "../api/postApi";
import { Button, Container } from "../components";

function ManagePosts() {
    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!userData?.$id) return;

        postService.getUserPosts(userData.$id).then((response) => {
            setPosts(response?.documents || []);
        });
    }, [userData?.$id]);

    const removePost = async (post) => {
        const deleted = await postService.deletePost(post.$id);

        if (deleted) {
            setPosts((current) => current.filter((item) => item.$id !== post.$id));
        }
    };

    return (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Hero section */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="flex-1">
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                                Your content
                            </p>
                            <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                                Manage posts
                            </h1>
                            <p className="mt-5 text-base leading-7 text-stone-600">
                                Review drafts, edit published work, and organize your content library.
                            </p>
                        </div>
                        <Link
                            to="/dashboard/posts/new"
                            className="inline-flex items-center justify-center rounded-sm bg-stone-950 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-stone-700 active:scale-[0.98]"
                        >
                            New post
                        </Link>
                    </div>
                </Container>
            </div>

            {/* Posts list */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <div className="overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
                        {posts.length ? (
                            <div className="divide-y divide-stone-200">
                                {posts.map((post) => (
                                    <div
                                        key={post.$id}
                                        className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center"
                                    >
                                        <div>
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                        post.status === "active"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {post.status === "active" ? "Published" : "Draft"}
                                                </span>
                                                <span className="text-xs font-medium text-stone-400">
                                                    {post.$id}
                                                </span>
                                            </div>
                                            <h2 className="font-serif text-xl font-semibold text-stone-950">
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="mt-2 text-sm leading-6 text-stone-600">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                to={`/post/${post.$id}`}
                                                className="rounded-sm border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/dashboard/posts/${post.$id}/edit`}
                                                className="rounded-sm border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                                            >
                                                Edit
                                            </Link>
                                            <Button
                                                bgColor="bg-red-600"
                                                className="px-4 py-2 text-sm hover:bg-red-700"
                                                onClick={() => removePost(post)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <h2 className="font-serif text-2xl font-semibold text-stone-950">
                                    No posts yet
                                </h2>
                                <p className="mt-3 text-stone-500">
                                    Start with a draft, then publish when ready.
                                </p>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default ManagePosts;

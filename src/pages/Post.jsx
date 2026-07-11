import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../api/postApi";
import profileService from "../api/profileApi";
import bookmarkService from "../api/bookmarkApi";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [profile, setProfile] = useState(null);
    const [bookmark, setBookmark] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userID === userData.$id : false;
    const imageId = post?.featuredImage || post?.featuredimage || post?.image;
    const imageUrl = postService.getFileView(imageId);

    useEffect(() => {
        if (slug) {
            postService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    useEffect(() => {
        if (!post?.userID) return;

        profileService.getProfile(post.userID).then(setProfile);
    }, [post?.userID]);

    useEffect(() => {
        if (!userData?.$id || !post?.$id) return;

        bookmarkService.getBookmark(userData.$id, post._id).then(setBookmark);
    }, [userData?.$id, post?.$id]);

    const toggleBookmark = async () => {
        if (!userData?.$id) {
            navigate("/login");
            return;
        }

        const updatedBookmark = await bookmarkService.toggleBookmark(userData.$id, post._id);
        setBookmark(updatedBookmark);
    };

    const deletePost = () => {
        postService.deletePost(post.$id).then((status) => {
            if (status) {
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Full-width banner image (no overlay) */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-200">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-opacity duration-300"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-stone-400">Featured image unavailable</span>
                    </div>
                )}

                {/* Action buttons overlaid on banner */}
                <div className="absolute left-6 top-6">
                    <Button
                        bgColor={bookmark ? "bg-stone-950" : "bg-white"}
                        textColor={bookmark ? "text-white" : "text-stone-950"}
                        className="shadow-sm hover:bg-stone-950 hover:text-white"
                        onClick={toggleBookmark}
                    >
                        {bookmark ? "Saved" : "Save"}
                    </Button>
                </div>

                {isAuthor && (
                    <div className="absolute right-6 top-6 flex gap-2">
                        <Link to={`/dashboard/posts/${post.$id}/edit`}>
                            <Button bgColor="bg-stone-700" className="shadow-sm hover:bg-stone-950">
                                Edit
                            </Button>
                        </Link>
                        <Button bgColor="bg-red-600" className="shadow-sm hover:bg-red-700" onClick={deletePost}>
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Post metadata + content */}
            <Container>
                <article className="mx-auto max-w-3xl py-12">
                    {/* Tags row */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-sm border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 font-serif text-5xl font-bold leading-[1.15] text-stone-950 md:text-6xl">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-100 mt-5 text-lg leading-8 text-stone-600">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author row */}
                    <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-200 mt-8 flex items-center gap-4 border-y border-stone-200 py-5">
                        {/* Avatar circle placeholder */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-bold text-stone-700">
                            {profile?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <Link
                                to={`/authors/${post.userID}`}
                                className="block font-semibold text-stone-950 transition-colors hover:text-stone-600"
                            >
                                {profile?.name || "View author"}
                            </Link>
                            <p className="text-sm text-stone-500">
                                {new Date(post.$createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Content body */}
                    <div className="browser-css motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000 motion-safe:delay-300 mt-10">
                        {parse(post.content)}
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profileService from "../api/profileApi";
import postService from "../api/postApi";
import { Container, PostCard } from "../components";

function AuthorProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        profileService.getProfile(id).then(setProfile);
        postService.getPublishedPosts().then((response) => {
            const authored = (response?.documents || []).filter((post) => post.userID === id);
            setPosts(authored);
        });
    }, [id]);

    return (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Header section with author info */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                            Author profile
                        </p>
                        <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                            {profile?.name || "Blog author"}
                        </h1>
                        <p className="mt-5 text-base leading-7 text-stone-600">
                            {profile?.bio || "This author has not added a public bio yet."}
                        </p>
                        {(profile?.website || profile?.github || profile?.linkedin) && (
                            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                                {profile?.website && (
                                    <a
                                        className="rounded-sm border border-stone-200 bg-white px-4 py-2 transition-colors hover:bg-stone-950 hover:text-white"
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Website
                                    </a>
                                )}
                                {profile?.github && (
                                    <a
                                        className="rounded-sm border border-stone-200 bg-white px-4 py-2 transition-colors hover:bg-stone-950 hover:text-white"
                                        href={profile.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {profile?.linkedin && (
                                    <a
                                        className="rounded-sm border border-stone-200 bg-white px-4 py-2 transition-colors hover:bg-stone-950 hover:text-white"
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            {/* Posts section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl font-semibold text-stone-950">Published posts</h2>
                        <p className="mt-2 text-sm text-stone-500">
                            {posts.length} {posts.length === 1 ? "article" : "articles"}
                        </p>
                    </div>

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
                            <h2 className="font-serif text-2xl font-semibold text-stone-950">No published posts yet</h2>
                            <p className="mt-3 text-stone-500">This author hasn't published any articles.</p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default AuthorProfile;

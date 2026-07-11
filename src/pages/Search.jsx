import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import postService from "../api/postApi";
import { Container, PostCard } from "../components";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const searchTerm = searchParams.get("q") || "";

        postService.searchPosts(searchTerm).then((response) => {
            setPosts(response?.documents || []);
        });
    }, [searchParams]);

    const submitSearch = (event) => {
        event.preventDefault();
        setSearchParams(query ? { q: query } : {});
    };

    return (
        <div className="w-full bg-white">
            {/* Full-bleed hero matching Home/AllPost pattern */}
            {/* TODO: Replace '/search-bg.jpg' with your actual background image */}
            <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/search-bg.png')" }}>
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-36">
                    <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                        Find your next read
                    </p>
                    <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 mx-auto max-w-3xl font-serif text-5xl font-semibold leading-[1.1] text-white md:text-6xl">
                        Search posts
                    </h1>
                    <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 mx-auto mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                        Find articles by title, topic, or author — discover stories that match exactly what you're looking for.
                    </p>
                </div>
            </div>

            <div className="bg-stone-50 py-12">
                <Container>
                    {/* Search form */}
                    <form onSubmit={submitSearch} className="mb-10 flex gap-2">
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
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

                    {/* Results grid */}
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
                            <h2 className="font-serif text-2xl font-semibold text-stone-950">No results found</h2>
                            <p className="mt-3 text-stone-500">Try different keywords or browse all posts.</p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default Search;


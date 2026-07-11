import postService from '../api/postApi'
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage, featuredimage, image, excerpt, tags }, index = 0) {
    const imageId = featuredImage || featuredimage || image
    const imageUrl = postService.getFileView(imageId)
    const delay = typeof index === 'number' ? index * 75 : 0

    return (
        <Link
            to={`/post/${$id}`}
            className="group block h-full"
            style={{ animationDelay: `${delay}ms` }}
        >
            <article className='h-full overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl'>
                {/* Image block — structured for bg-image swap later */}
                <div className='relative aspect-[16/10] w-full overflow-hidden bg-stone-200 bg-cover bg-center transition-opacity duration-300'>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            className='h-full w-full object-cover transition-all duration-300 group-hover:scale-105 motion-safe:transition-transform'
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-stone-300/60">
                            <span className="text-xs font-medium uppercase tracking-widest text-stone-500">No image</span>
                        </div>
                    )}
                    {/* Bottom overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>

                <div className="p-5">
                    {/* Uppercase eyebrow */}
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Article</p>
                    {/* Serif title */}
                    <h2 className='line-clamp-2 font-serif text-xl font-semibold leading-snug text-stone-950 transition-colors duration-150 group-hover:text-stone-700'>
                        {title}
                    </h2>
                    {excerpt && (
                        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-stone-500">{excerpt}</p>
                    )}
                    {Array.isArray(tags) && tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-sm border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}

export default PostCard

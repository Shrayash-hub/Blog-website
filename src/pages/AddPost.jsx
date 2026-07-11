import { Container, PostForm } from '../components'

function AddPost(){
    return (
        <div className='w-full bg-white'>
            {/* Full-bleed hero with background image */}
            <div className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden bg-stone-800 bg-cover bg-center pt-16 md:min-h-[740px] md:pt-20" style={{ backgroundImage: "url('/write-bg.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/20" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
                    <div className="max-w-3xl">
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                            Create
                        </p>
                        <h1 className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 font-serif text-5xl font-semibold leading-[1.1] text-white md:text-6xl">
                            Write a new post.
                        </h1>
                        <p className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-150 mt-5 text-base leading-7 text-white/75 md:text-lg">
                            Craft your story, add a featured image, choose tags, and publish when ready. Your words deserve a great stage — let's build it together.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <PostForm />
                </Container>
            </div>
        </div>
    )
}

export default AddPost


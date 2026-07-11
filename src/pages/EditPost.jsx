import { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import postService from "../api/postApi";
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            postService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
    return post ? (
        <div className='w-full bg-white pt-16 md:pt-20'>
            {/* Hero section */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                            Edit
                        </p>
                        <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                            Update your post
                        </h1>
                        <p className="mt-5 text-base leading-7 text-stone-600">
                            Refine your content, update images and tags, or change publication status.
                        </p>
                    </div>
                </Container>
            </div>

            {/* Form section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <PostForm post={post} />
                </Container>
            </div>
        </div>
    ) : null
}

export default EditPost

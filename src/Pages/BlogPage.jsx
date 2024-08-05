import { onValue, ref, set } from 'firebase/database'
import React, { Fragment, useEffect, useState } from 'react'
import { database } from '../utils/firebaseConfig'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RiArrowDownSLine, RiArrowRightSLine } from '@remixicon/react'
import NewBlogEdit from '../utils/NewBlogEdit';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([])
    const [showSection, setShowSection] = useState(false)
    const [showBlogEdit, setShowBlogEdit] = useState(false)


    // Retrieving data from the database
    useEffect(() => {
        onValue(ref(database, 'data/Blogs/allBlogs'), (snapshot) => {
            if (snapshot !== null) {
                setBlogs(snapshot.val())
            }
        })
    }, [])

    const updateContent = (value, id) => {
        setBlogs(prev =>
            prev.map(blog =>
                blog.id === id ? { ...blog, content: value } : blog
            )
        );
    }


    // Updating the title, date of the blog
    const updateText = (update, selector, id) => {
        setBlogs(prev =>
            prev.map(blog =>
                blog.id === id ? { ...blog, [selector]: update } : blog
            )
        );
    };

    // setting the updated blog content in the database
    const changeBlogData = () => {
        let success = false
        set(ref(database, 'data/Blogs/allBlogs'), blogs);
        success = true
        if (success) alert('Data Changed')
    }

    // Deleting the blog from the database
    const deleteBlog = (id) => {
        const res = confirm('Do you want to delete the blog?')
        if (!res) return

        setBlogs(prev => {
            const blogsAfterDeletion = prev.filter(blog => blog.id !== id)
            set(ref(database, 'data/Blogs/allBlogs'), blogsAfterDeletion);
            return blogsAfterDeletion
        })
        alert('Blog Deleted')
    }

    return (
        <section className='w-full h-screen flex items-center'>
            <div className='w-3/4 h-[80%] ml-auto flex flex-col gap-5 mr-10 p-10 shadow-2xl overflow-y-scroll'>

                <Fragment>
                    <h1 onClick={() => setShowSection(prev => !prev)} className='text-xl font-medium flex gap-1 items-center'>All Blogs <span>{showSection ? <RiArrowDownSLine /> : <RiArrowRightSLine />}</span></h1>
                    <div className={`${showSection ? '' : 'hidden'}`}>
                        {blogs?.length !== 0 && blogs?.map((blog) => (
                            <>
                                {Object.keys(blog).length !== 0 && Object.keys(blog).map(key => (
                                    key !== 'content' ? (
                                        <div className={`flex flex-col gap-1`}>
                                            <div className='flex flex-col gap-2'>
                                                <label className='font-medium mt-3' htmlFor={key}>{key}</label>
                                                <input
                                                    onChange={(e) => updateText(e.target.value, key, blog.id)}
                                                    className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                                    type="text"
                                                    id={key}
                                                    value={blog[key] || ''} />
                                                {key.startsWith('image') && (
                                                    <img className='w-44' src={blog[key]} alt="" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button className='mt-4 px-4 py-1 rounded-md bg-green-400 mb-3' onClick={() => setShowBlogEdit(true)}>Change Content</button>
                                            {showBlogEdit && (
                                                <>
                                                    <div onClick={() => setShowBlogEdit(false)} className='fixed z-30 bg-black h-full w-full left-0 top-0 opacity-40'></div>
                                                    <div className='w-full h-full overflow-y-scroll remove-scroll bg-white absolute p-3 z-50 top-0 left-0 translate-x-10 translate-y-5'>
                                                        <ReactQuill
                                                            value={blog[key] || ''}
                                                            onChange={(e) => updateContent(e, blog.id)}
                                                            modules={{
                                                                toolbar: [
                                                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                    [{ size: [] }],
                                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                                    { 'indent': '-1' }, { 'indent': '+1' }],
                                                                    ['link', 'image', 'video'],
                                                                    ['clean']
                                                                ],
                                                                clipboard: {
                                                                    matchVisual: false,
                                                                }
                                                            }}
                                                            formats={[
                                                                'header', 'font', 'size',
                                                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                                'list', 'bullet', 'indent',
                                                                'link', 'image', 'video'
                                                            ]}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )
                                ))}
                                <div className='flex gap-2 mt-4'>
                                    <button className='px-3 py-1 bg-blue-400 rounded-md font-medium' onClick={() => changeBlogData()}>Change</button>
                                    <button onClick={() => deleteBlog(blog.id)} className='rounded-md px-3 py-1 bg-red-500'>Delete Blog</button>
                                </div>
                            </>
                        ))}
                    </div>
                    <NewBlogEdit setBlogs={setBlogs} />
                </Fragment>
            </div>
        </section>
    )
}

export default BlogPage
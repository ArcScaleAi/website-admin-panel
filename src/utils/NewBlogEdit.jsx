import React, { useEffect, useState } from 'react'
import { ref, set } from 'firebase/database';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';
import { database } from './firebaseConfig';

const NewBlogEdit = ({ setBlogs }) => {
    const [value, setValue] = useState("Blog Content here");
    const [newBlog, setNewBlog] = useState({})
    const [showBlogEdit, setShowBlogEdit] = useState(false)
    const blogArr = ['Title', 'Date', 'Para', 'Image', 'Time']


    const updateContent = (value, label) => {
        setNewBlog(prev => ({ ...prev, [label]: value }))
    }


    useEffect(() => {
        setNewBlog(prev => ({ ...prev, content: value }))
    }, [value])


    const handleAddBlog = () => {
        const blogWithId = { ...newBlog, id: uuidv4() }
        setBlogs((prev) => {
            let updatedBlogs;
            if (!prev) {
                updatedBlogs = [blogWithId];
            } else {
                updatedBlogs = [...prev, blogWithId];
            }
            set(ref(database, 'data/Blogs/allBlogs'), updatedBlogs);
            alert('New Blog Added')
            return updatedBlogs;
        });

    }
    

    return (
        <>
            <button className='px-3 py-1 rounded-md bg-yellow-500 w-[170px]' onClick={() => setShowBlogEdit(true)}>Add new blog</button>
            {showBlogEdit && (
                <>
                    <div onClick={() => setShowBlogEdit(false)} className='fixed z-30 bg-black h-full w-full left-0 top-0 opacity-40'></div>
                    <section className='w-full h-full'>
                        <div className='w-[95%] max-h-[90%] p-4 overflow-y-scroll remove-scroll bg-white absolute z-50 top-0 left-0 translate-x-10 translate-y-5'>


                            <div className='flex w-full ml-6 mb-6 gap-x-8 flex-wrap'>
                                {blogArr.map(key => (
                                    <div key={key} className='flex w-[30%] flex-col gap-2'>
                                        <label className='font-medium mt-3' htmlFor={key}>{key}</label>
                                        <input
                                            onChange={(e) => updateContent(e.target.value, key)}
                                            className='w-full border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                            type="text"
                                            value={newBlog[key]} />
                                    </div>
                                ))}
                            </div>


                            <ReactQuill
                                value={value}
                                onChange={setValue}
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
                            <button className='mt-3 px-4 py-1 rounded-sm bg-blue-400 ml-3 mb-2' onClick={handleAddBlog}>Add Blog</button>
                        </div>
                    </section>
                </>
            )}
        </>
    )
}

export default NewBlogEdit
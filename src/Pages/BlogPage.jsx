import { onValue, ref, set } from 'firebase/database'
import React, { Fragment, useEffect, useState } from 'react'
import { database } from '../utils/firebaseConfig'
import { v4 as uuidv4 } from 'uuid';
import { RiArrowDownSLine, RiArrowRightSLine } from '@remixicon/react'

const BlogPage = () => {
    const [blogs, setBlogs] = useState([])
    const [showBulletPoints, setShowBulletPoints] = useState(false)
    // const [bulletPoints, setBulletPoints] = useState(new Array(1).fill(''))
    const [showSection, setShowSection] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [showAddBlog, setShowAddBlog] = useState(false)
    const [newBlog, setNewBlog] = useState({ id: uuidv4(), title: '', para: '', image: '', content: [] });
    const [blogContent, setBlogContent] = useState([])
    const [showH3Section, setShowH3Section] = useState(false)

    const [heading2, setHeading2] = useState({
        head: '',
        content: '',
        h3: [],
        show: false,
        bulletContent: [],
    })
    const [heading3, setHeading3] = useState({
        head: '',
        content: '',
        bulletContent: [],
        show: false,
    })
    const addBlogArr = ['title', 'image', 'para', 'Date', 'Time', 'content']

    useEffect(() => {
        onValue(ref(database, 'data/Blogs/allBlogs'), (snapshot) => {
            if (snapshot !== null) {
                setBlogs(snapshot.val())
            }
        })
    }, [])

    console.log(blogs);


    const updateText = (update, selector, id) => {
        selector === 'title' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, title: update }) : blog))
        selector === 'image' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, image: update }) : blog))
        selector === 'para' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, para: update }) : blog))
        selector === 'date' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, date: update }) : blog))
        selector === 'time' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, time: update }) : blog))
        selector === 'content' && setBlogs(prev => prev.map(blog => blog.id === id ? ({ ...blog, content: update }) : blog))
    }

    const writeUserData = () => {
        let success = false
        set(ref(database, 'data/Blogs/allBlogs'), blogs);
        success = true
        if (success) alert('Date Changed')
    }

    const handlenewBlog = (value, key) => {
        console.log(key);
        setNewBlog(prev => ({ ...prev, [key]: value }));
    }


    const handleHead = () => {
        if (!showH3Section) {
            const newHeading2 = { ...heading2 }
            setBlogContent(prev => {
                const updatedBlogContent = ([...prev, newHeading2])
                setNewBlog(prev => ({ ...prev, content: updatedBlogContent }));
                return updatedBlogContent;
            })
            heading2.head = ''
            heading2.content = ''
            heading2.date = ''
            heading2.time = ''
            heading2.bulletContent = []
        } 
        
        heading2.h3 = []
        setShowH3Section(false)
    }
    
    const handleH3 = () => {
        if (inputValue !== '') {
            alert('Add the Bullet Point first')
            return
        }
        const newHeading3 = { ...heading3 }
        setHeading2(prev => ({ ...prev, h3: [...prev.h3, newHeading3] }))
        setShowH3Section(false)
        heading3.head = ''
        heading3.content = ''
        heading3.bulletContent = []
    }
    
    const handleBulletPoints = () => {
        setHeading3(prev => ({ ...prev, bulletContent: [...prev.bulletContent, inputValue] }))
        setInputValue('')
    }

    const handleAddBlog = () => {
        const newBlogWithId = { ...newBlog, id: uuidv4() };
        let success = false
        setBlogs(prev => {
            const updatedBlogs = [...prev, newBlogWithId]
            set(ref(database, 'data/Blogs/allBlogs'), updatedBlogs);
            return updatedBlogs
        })
        success = true
        if (success) alert('Blog Added')
        setNewBlog({ id: uuidv4(), title: '', image: '', content: '' });
    }

    console.log(heading2, heading3);
    console.log(newBlog);
    console.log(blogContent);
    return (
        <section className='w-full h-screen flex items-center'>
            <div className='w-3/4 h-[80%] ml-auto flex flex-col gap-5 mr-10 p-10 shadow-2xl overflow-y-scroll'>
                <Fragment>
                    <h1 onClick={() => setShowSection(prev => !prev)} className='text-xl font-medium flex gap-1 items-center'>All Blogs <span>{showSection ? <RiArrowDownSLine /> : <RiArrowRightSLine />}</span></h1>
                    <div className={`${showSection ? '' : 'hidden'}`}>
                        {blogs?.length !== 0 && blogs.map((blog) => (
                            <>
                                {Object.keys(blog).length !== 0 && Object.keys(blog).map(key => (
                                  key !== 'content' && (
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
                                  )
                                ))}
                                <button className='mt-4 px-3 py-1 bg-blue-400 rounded-md font-medium' onClick={() => writeUserData()}>Change</button>
                            </>
                        ))}
                    </div>
                    <button className='w-fit px-3 py-1 bg-green-400 rounded-md font-medium' onClick={() => setShowAddBlog(prev => !prev)}>{showAddBlog ? 'Do not add Blog' : 'Add Blog'}</button>
                    <div className={showAddBlog ? '' : 'hidden'}>
                        {addBlogArr.map(key => (
                            <div className={`flex flex-col gap-1`}>
                                <div className='flex flex-col gap-2'>
                                    {key === 'content' ? (<label className='font-semibold mt-3' htmlFor={key}>{key}</label>) :
                                        (<label className='font-semibold mt-3' htmlFor={key}>{key}</label>)
                                    }
                                    {key === 'content' ? (
                                        <div className='flex gap-2'>
                                            <p className={`inline-block text-2xl text-blue-400 px-3 py-1 font-semibold`}>Add H2 Section</p>
                                        </div>
                                    ) : (
                                        <input
                                            onChange={(e) => handlenewBlog(e.target.value, key)}
                                            className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                            type="text"
                                            id={key}
                                            value={newBlog[key]}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}

                        <>
                            <div className='flex flex-col'>
                                <label className='font-medium mt-3' htmlFor='head'>Head</label>
                                <input
                                    onChange={(e) => setHeading2(prev => ({ ...prev, head: e.target.value }))}
                                    className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                    type="text"
                                    value={heading2.head}
                                />
                                <label className='font-medium mt-3' htmlFor='head'>Para</label>
                                <input
                                    onChange={(e) => setHeading2(prev => ({ ...prev, content: e.target.value }))}
                                    className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                    type="text"
                                    value={heading2.content}
                                />

                                <p onClick={() => setShowH3Section(true)} className={`inline-block mt-4 text-2xl text-blue-400 px-3 py-1 cursor-pointer font-semibold`}>Add H3 Section</p>
                                {showH3Section && (
                                    <>
                                        <label className='font-medium mt-3' htmlFor='head'>Head</label>
                                        <input
                                            onChange={(e) => setHeading3(prev => ({ ...prev, head: e.target.value }))}
                                            className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                            type="text"
                                            value={heading3.head}
                                        />
                                        <label className='font-medium mt-3' htmlFor='head'>Para</label>
                                        <input
                                            onChange={(e) => setHeading3(prev => ({ ...prev, content: e.target.value }))}
                                            className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                            type="text"
                                            value={heading3.content}
                                        />
                                        <button onClick={() => setShowBulletPoints(true)} className='mt-4 w-[180px] block px-3 py-1 bg-purple-400 rounded-md font-medium'>Add Bullet Points</button>
                                    </>
                                )}


                                {(showBulletPoints && showH3Section)  && (
                                    <ul className='w-full'>
                                        <div className='flex gap-2'>
                                            <li className='w-[90%]'><input
                                                onChange={(e) => setInputValue(e.target.value)}
                                                className='border w-full mt-4 border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                                type="text"
                                                value={inputValue}
                                            />
                                            </li>
                                            <button onClick={() => handleBulletPoints()} className='mt-4 w-[100px] block justify-start px-3 py-1 bg-slate-400 rounded-md font-medium'>Add</button>
                                        </div>
                                    </ul>
                                )}
                                <button onClick={() => showH3Section ? handleH3() : handleHead()} className='w-[150px] mt-4 px-3 py-1 bg-yellow-400 rounded-md font-medium'>{showH3Section ? 'Add H3' : 'Add Section'}</button>
                            </div>
                        </>

                        <button className='mt-4 w-[170px] block px-3 py-1 bg-red-400 rounded-md font-medium' onClick={() => handleAddBlog()}>Add Blog</button>
                    </div>
                </Fragment>
            </div>
        </section>
    )
}

export default BlogPage
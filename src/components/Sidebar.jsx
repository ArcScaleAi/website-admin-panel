import React from 'react'
import { useFirebaseContext } from '../contexts/FirebaseContext'
import { signOut } from 'firebase/auth'
import { auth } from '../utils/firebaseConfig'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const userlogout = () => {
    signOut(auth)
    localStorage.removeItem('token')
    navigate('/')
  }

  const {setPage} = useFirebaseContext()

  return (
   <section className='w-full relative p-2'>
        <div className='w-[250px] h-[98%] bg-[#1e2434] text-white text-lg fixed shadow-2xl pt-16 pl-8 flex flex-col gap-6'>
            <span onClick={() => setPage('HomePage')} className='tracking-wider cursor-pointer'>Home Page</span>
            <span onClick={() => setPage('RetailPage')} className='tracking-wider cursor-pointer'>Retail Page</span>
            <span onClick={() => setPage('ProductPage')} className='tracking-wider cursor-pointer'>Product Page</span>
            <span onClick={() => setPage('UsersPage')} className='tracking-wider cursor-pointer'>Users Page</span>
            <span onClick={() => setPage('FAQPage')} className='tracking-wider cursor-pointer'>FAQ Page</span>
            <span onClick={() => setPage('BlogPage')} className='tracking-wider cursor-pointer'>Blog Page</span>
            <span onClick={() => setPage('ContactPage')} className='tracking-wider cursor-pointer'>Contact Page</span>
            <span onClick={() => setPage('AboutPage')} className='tracking-wider cursor-pointer'>About Us Page</span>
            <button onClick={() => userlogout()} className='px-4 py-2 rounded-md font-medium bg-white mt-3 w-[100px] text-black'>Logout</button>
        </div>
   </section>
  )
}

export default Sidebar
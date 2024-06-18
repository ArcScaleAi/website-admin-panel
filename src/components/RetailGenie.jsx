import React, { Fragment, useEffect, useState } from 'react'
import { RiArrowRightSLine } from '@remixicon/react'
import { onValue, ref, set } from 'firebase/database'
import { database } from '../utils/firebaseConfig'


const RetailGenie = ({ data }) => {
    const [retailGenie, setRetailGenie] = useState([])
    const [showSection, setShowSection] = useState(false)

    useEffect(() => {
        onValue(ref(database, 'data/retailPage/genieBox'), (snapshot) => {
            if (snapshot !== null) {
                setRetailGenie(snapshot.val())
            }
        })
    }, [])


    // const updateText = (update, selector) => {
    //     selector === 'title' && setRetailMain(prev => ({...prev, title: update}))
    //     selector === 'image' && setRetailMain(prev => ({...prev, image: update}))
    //     selector === 'para' && setRetailMain(prev => ({...prev, para: update}))
    //     selector === 'bg' && setRetailMain(prev => ({...prev, bg: update}))
    // }

    const writeUserData = () => {
        let success = false
        set(ref(database, 'data/retailPage/genieBox'), retailGenie);
        success = true
        if (success) alert('Date Changed')
    }


    console.log(retailGenie);
    return (
        <Fragment>
            <h1 onClick={() => setShowSection(prev => !prev)} className='text-xl font-medium flex gap-1 items-center'>Retail Genie Section <span><RiArrowRightSLine /></span></h1>
            <div className={`${showSection ? '' : 'hidden'} `}>
                {retailGenie?.length !== 0 && retailGenie.map((genie) => (
                    <>
                        {Object.keys(genie).length !== 0 && Object.keys(genie).map(key => (
                                <div className={`flex flex-col gap-1`}>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-medium mt-3' htmlFor={key}>{key}</label>
                                        <input
                                            // onChange={(e) => updateText(e.target.value, key)}
                                            className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                            type="text"
                                            id={key}
                                            value={genie[key] || ''} />
                                        {key.startsWith('image') && (
                                            <img className='w-44' src={genie[key]} alt="" />
                                        )}
                                    </div>
                                </div> 
                        ))}
                    </>
                ))}
                <button className='mt-4 px-3 py-1 bg-blue-400 rounded-md font-medium' onClick={() => writeUserData()}>Change</button>
            </div>
        </Fragment>
    )
}

export default RetailGenie
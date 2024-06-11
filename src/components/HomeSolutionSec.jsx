import { RiArrowRightSLine } from '@remixicon/react'
import { onValue, ref } from 'firebase/database'
import React, { Fragment, useEffect, useState } from 'react'
import { database } from '../utils/firebaseConfig'

const HomeSolutionSec = ({ data }) => {
    const [showSection, setShowSection] = useState(false)
    const [solutionData, setSolutionData] = useState({})

    useEffect(() => {
        onValue(ref(database, 'data/homePage/solution'), (snapshot) => {
            if(snapshot !== null){
                setSolutionData(snapshot.val())
            }
        })
    }, [])

    // useEffect(() => {
    //     setSolutionData(data?.homePage?.solution)
    // }, [data])

    return (
        <Fragment>
            <h1 onClick={() => setShowSection(prev => !prev)} className='text-xl font-medium flex gap-1 items-center'>Solution Section <span><RiArrowRightSLine /></span></h1>
            {Object.keys(solutionData  || {}) !== 0 && Object.keys(solutionData  || {}).map(key => (
                <>
                    {Object.keys(data) !== 0 && (
                        <div className={`flex flex-col gap-1 ${showSection ? '' : 'hidden'}`}>
                            <div className='flex flex-col gap-2'>
                                <label className='font-medium' htmlFor={key}>{key}</label>
                                <input
                                    // onChange={(e) => updateText(e.target.value, 'landing-title')}
                                    className='w-[80%] border border-gray-200 rounded-sm px-3 h-[40px] focus:outline-none'
                                    type="text"
                                    id={key}
                                    value={solutionData[key] || ''} />
                                    {key.startsWith('image') && (
                                        <img className='w-44' src={solutionData[key]} alt="" />
                                    )}
                            </div>
                        </div>
                    )}
                </>
            ))}
        </Fragment>
    )
}

export default HomeSolutionSec
import React, { useState } from 'react'
import BreedCrump from '../BreedCrump'
import { Link } from 'react-router-dom'

const ProfileLayout = ({ pageTitle, navLinks = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (<div className={`flex flex-col gap-4`}>
        {/* BreedCrump */}
        <BreedCrump breed_title={pageTitle} />

        {/* NavLinks */}
        <div className={`flex flex-row gap-2 items-center`}>
            {
                navLinks.map((nLink, index) => (
                    <Link key={index} className={`rounded-xl py-2 px-4 text-lg font-medium ${activeIndex === index ? 'bg-primary-color text-white' : 'border border-primary-color text-primary-color hover:bg-second-color hover:text-white transition'} `}
                        onClick={() => setActiveIndex(index)}
                    >{nLink.title}</Link>
                ))
            }
        </div>

        {/* Content */}

        <div className={`w-full flex flex-col gap-2 `}>
            {
                navLinks[activeIndex].element
            }
        </div>


    </div>);
}

export default ProfileLayout
import React from 'react'

import { useSelector } from 'react-redux'

const HeroBrand = ({ heroBrandTitle, heroBrandDescription }) => {
    const lang = useSelector((state) => state.webLanguage);

    return (
        <div className={`w-full min-h-screen h-full ${lang === 'en' ? 'rounded-l-2xl' : 'rounded-r-2xl'} bg-second-color flex flex-col justify-center items-center gap-4`}>
            <div className={`w-[34rem] h-[34rem] rounded-2xl flex justify-center items-center`}>

                <img src={lang === 'ar' ? '/heroLogin_ar.png' : '/heroLogin_en.png'} alt={`fixclick-dashboard`} className={`w-full h-full rounded-2xl`} />
            </div>
            <div className={`flex flex-col justify-center items-center gap-4`}>
                <p className={`text-3xl font-bold text-white`}>{heroBrandTitle}</p>
                <p className={`text-base text-white-2 max-w-lg text-wrap text-center`}>{heroBrandDescription}</p>
            </div>
        </div>
    )
}

export default HeroBrand
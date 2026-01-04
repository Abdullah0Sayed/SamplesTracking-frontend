import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'

const Review = ({ dataFrom }) => {
    return (
        <div className={`w-full flex flex-col justify-center items-center`}>
            <div className={`success-icon place-content-center`}>
                <BiCheckCircle className={`text-[12rem] text-green-600`} />
            </div>
            <div className={`w-full flex flex-col justify-center items-center gap-2`}>
                <p className={`text-2xl font-black`}>تم تسجيل البيانات بنجاح</p>
                <p className={`text-xl`}>تم إرسال رمز التحقق لبريدك الإلكتروني</p>
            </div>
        </div>
    )
}

export default Review
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BiBlock, BiFileFind, BiFolder, BiLock, BiLockAlt } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
const NotFound = () => {

    const { t } = useTranslation('global');
    const navigate = useNavigate();

    return (
        <div className="p-8 min-h-screen flex flex-col gap-4 justify-center items-center" dir="rtl">





            <div className={`w-[28rem] text-primary-color flex justify-center items-center `}>
                <img src={'/notFound404.svg'} alt={`not-found-page`} className={` h-full object-cover`} style={{ backgroundBlendMode: 'lighten' }} />
            </div>
            <p className={`text-4xl text-primary-color font-black`}>{t('global.pageNotFoundHeading')}</p>
            <p className={`font-black text-sm text-black/20`}>{t('global.pageNotFoundHint')}</p>
            <button className={`p-2 flex flex-row justify-center items-center gap-1  text-primary-color font-semibold text-sm `} onClick={() => navigate(-1, {
                replace: true
            })} >
                العودة للصفحة السابقة
            </button>




        </div>
    )
}

export default NotFound
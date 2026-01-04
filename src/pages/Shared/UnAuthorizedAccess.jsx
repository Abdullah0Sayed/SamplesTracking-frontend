import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BiBlock, BiFileFind, BiLock, BiLockAlt } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

const UnAuthorizedAccess = () => {
    const { t } = useTranslation('global');
    const navigate = useNavigate();

    return (
        <div className="p-8 min-h-screen space-y-8" dir="rtl">





            <div className={`w-full h-full flex flex-col gap-3 justify-center items-center bg-white shadow rounded p-4`}>
                <div className={`w-48 h-48  text-primary-color flex justify-center items-center `}>

                    <BiBlock className={`text-9xl`} />
                </div>
                <p className={`text-4xl text-primary-color font-black`}>{t('global.unAuthorizedAccessHeading')}</p>
                <p className={`font-black text-sm text-black/20`}>{t('global.unAuthorizedAccessHint')}</p>
                <button className={`p-2 border flex flex-row justify-center items-center gap-1 border-primary-color text-primary-color font-semibold text-sm hover:bg-primary-color/90 hover:text-white transition-all rounded`} onClick={() => navigate(-1, {
                    replace: true
                })} >
                    العودة للصفحة السابقة
                </button>
            </div>




        </div>
    )
}

export default UnAuthorizedAccess
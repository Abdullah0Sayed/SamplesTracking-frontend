import React from 'react'
import HeroBrand from '../../components/ui/HeroBrand'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from '../../components/forms/Form';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth/authService';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';
import { motion } from "framer-motion";



const VerifiedPage = ({ type = 'password' }) => {
    const { t } = useTranslation('global');

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const dispatch = useDispatch();



    const onSubmit = async (data) => {
        const payload = {
            email: email,
            code: data.code
        }
        console.log(payload)

        try {

            const res = await authService.verifyOtp(payload);

            if (res.status === 200) {
                console.log(res.data)
                toast.success(`تم التحقق بنجاح , جاري تحويلك للوحة التحكم`);
                dispatch(setUser({ user: res.data.data, token: res.data.token }));
                navigate('/dashboard')
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error.message}`)
        }
    }

    return (
        <div className={`flex flex-col gap-4`}>

            <Header />
            <div className={`w-11/12 mx-auto rounded-2xl border shadow-md flex flex-row mb-4`}>
                <HeroBrand heroBrandTitle={t('auth.login.heroLoginHeading')} />
                <div className={`w-full min-h-screen h-full flex flex-col gap-8 justify-center items-center`}>
                    <div className={`w-5/6 flex flex-col justify-center items-center gap-4`}>
                        <div className={`image-container overflow-hidden`}>
                            <motion.img
                                className={`object-cover w-full h-auto`}
                                src={'/success.svg'}
                                alt={`verified-success`}
                                initial={{ width: 0, opacity: 0 }}
                                animate={{
                                    width: 200,
                                    opacity: 1,

                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",

                                }}
                            />
                        </div>
                        <p className={`text-3xl max-w-lg text-center text-wrap font-bold`}>
                            {type && type === 'phone' ? t('global.phoneVerified') : t('global.passwordVerified')}


                        </p>
                        <button className={`w-full px-4 py-4 bg-primary-color text-white rounded-md text-center hover:scale-95 transition-all`} type='button'>
                            {type && type === 'phone' ? t('global.continue') : t('auth.login.title')}

                        </button>

                    </div>

                </div>
            </div>
        </div>


    )
}

export default VerifiedPage
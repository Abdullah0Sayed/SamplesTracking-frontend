import React from 'react'
import HeroBrand from '../../components/ui/HeroBrand'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from '../../components/forms/Form';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth/authService';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';



const ForgetPassword = () => {
    const { t } = useTranslation('global');

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const dispatch = useDispatch();

    const FIELDS = [
        {
            name: 'phone',
            placeholder: t('auth.login.fields.phonePlaceHolder'),
            type: 'text',
            label: t('auth.login.fields.phone'),
            validation: { required: 'الكود مطلوب', minLength: { value: 6, message: 'الكود غير صالح' } },
            max_length: 6
        }
    ]

    const INITIAL_VALUES = {
        phone: ''
    }

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
                <HeroBrand heroBrandTitle={t('auth.login.heroLoginHeading')} heroBrandDescription={t('auth.forgetPassword.heroLoginDescription')} />
                <div className={`w-full min-h-screen h-full flex flex-col gap-8 justify-center items-center`}>
                    <div className={`w-5/6 flex flex-col justify-start gap-4`}>
                        <p className={`text-2xl font-bold`}>{t('auth.forgetPassword.title')}</p>
                        <p className={`text-lg`}>{t('auth.forgetPassword.hint')}</p>
                    </div>
                    <div className={`w-5/6 flex flex-col gap-0`}>

                        <Form fields={FIELDS} initial_values={INITIAL_VALUES} submit_label={t('auth.forgetPassword.send')} onSubmit={onSubmit} showCancelBtn={false} />
                        <div className={`w-full flex flex-row justify-center items-center`}>

                            <Link to={'/'} className={`px-4 text-xs text-primary-color opacity-50 transition-all hover:opacity-100`}>{t('auth.forgetPassword.rememberPassword')} <span className={`text-second-color underline`}>{t('auth.login.title')}</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default ForgetPassword
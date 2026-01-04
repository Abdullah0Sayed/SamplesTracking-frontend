import React, { useEffect, useRef, useState } from 'react'
import HeroBrand from '../../components/ui/HeroBrand'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from '../../components/forms/Form';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth/authService';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';


const FIELDS = [
    {
        name: 'code',
        placeholder: 'أدخل رمز التححق والمكون من  أرقام',
        type: 'text',
        label: 'رمز التحقق',
        validation: { required: 'الكود مطلوب', minLength: { value: 6, message: 'الكود غير صالح' } },
        max_length: 6
    }
]

const INITIAL_VALUES = {
    code: ''
}
const VerifyOtp = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);

    const inputsRef = useRef([]);


    const { t } = useTranslation('global');

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const dispatch = useDispatch();


    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^[0-9]?$/.test(value)) {
            /** Tmp Array Have Same Values in OTP Array ::-> our work on tmp */
            const newOtp = [...otp];
            console.log(`New Otp Now ${newOtp}`);
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                inputsRef.current[index + 1].focus()
            }
        }

    }

    /** Focus For First Input */
    useEffect(() => {
        inputsRef.current[0].focus();

    }, []);

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
                <HeroBrand heroBrandTitle={t('auth.login.heroLoginHeading')} heroBrandDescription={t('auth.verifyOtp.heroLoginDescription')} />
                <div className={`w-full min-h-screen h-full flex flex-col gap-8 justify-center items-center`}>
                    <div className={`w-5/6 flex flex-col justify-start gap-2`}>
                        <p className={`text-2xl font-bold`}>{t('auth.verifyOtp.title')}</p>
                        <p className={`text-lg`}>{t('auth.verifyOtp.hint1')} <span className={`text-second-color`}>+966 588454572</span></p>
                        <p className={`text-lg`}>{t('auth.verifyOtp.hint2')}</p>
                    </div>
                    <div className={`w-5/6 flex flex-col gap-8 `}>

                        <div className={`flex justify-center items-center gap-[10px]`} dir="ltr">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`otp-${index}`}
                                    id={`otp-${index}`}
                                    className={`w-14 h-14 transition focus:ring-1 focus:ring-primary-color rounded-xl text-center outline-none focus:border-primary-color border shadow-sm text-primary-color font-bold`}
                                    maxLength={1}
                                    value={value}
                                    onChange={(e) => handleChange(e, index)}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    style={{ direction: 'ltr' }}
                                />
                            ))}
                        </div>

                        <button onClick={() => console.log(otp.join(""))} className={`w-full px-4 py-4 bg-primary-color text-white rounded-md text-center hover:scale-95 transition-all`} type='button'>{t('auth.verifyOtp.verify')}</button>


                        {/* <Form fields={FIELDS} initial_values={INITIAL_VALUES} submit_label={t('auth.verifyOtp.verify')} onSubmit={onSubmit} showCancelBtn={false} /> */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtp
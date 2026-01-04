import React, { useEffect, useMemo, useState } from 'react'
import HeroBrand from '../../components/ui/HeroBrand'
import Form from '../../components/forms/Form'
import { authService } from '../../services/auth/authService'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/ui/Header'
import { useTranslation } from 'react-i18next'
import { BiCheck } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../../toolkit/slicers/Api/loginThunk'



const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('global');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const FIELDS = useMemo(() => [
        {
            name: 'email',
            type: 'email',
            placeholder: t('auth.login.fields.emailPlaceHolder'),
            label: t('auth.login.fields.email'),
            validation: {
                required: 'البريد مطلوب',
                pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: 'صيغة البريد غير صحيحة'
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            placeholder: t('auth.login.fields.passwordPlaceHolder'),
            label: t('auth.login.fields.password'),
            validation: {
                required: 'كلمة المرور مطلوبة',
                minLength: {
                    value: 6,
                    message: 'كلمة المرور يجب ألا تقل عن 6 أحرف'
                }
            },
        },
    ], [t]);

    const INITIAL_VALUES = useMemo(() => ({
        email: '',
        password: '',
    }), []);


    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true })
        }
    }, [user, navigate])

    const onSubmit = async (data) => {
        try {
            const payload = { ...data, rememberMe };

            await dispatch(loginThunk(payload)).unwrap();

        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className={`flex flex-col gap-4`}>

            <Header />
            <div className={`w-3/4 mx-auto  flex flex-row mb-4`}>
                {/* <HeroBrand heroBrandTitle={t('auth.login.heroLoginHeading')} heroBrandDescription={t('auth.login.heroLoginDescription')} /> */}

                <div className={`w-full min-h-screen h-full flex flex-col gap-4 justify-center items-center`}>
                    <div className={`w-5/6 flex flex-col justify-start gap-4`}>
                        <p className={`text-2xl font-bold`}>{t('auth.login.title')}</p>
                        <p className={`text-lg`}>{t('auth.login.hint')}</p>
                    </div>
                    <div className={`w-5/6 flex flex-col gap-0`}>

                        <Form fields={FIELDS} initial_values={INITIAL_VALUES} submit_label={t('auth.login.title')} onSubmit={onSubmit} showCancelBtn={false} />
                        <div className={`w-full flex flex-row justify-between items-center`}>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="peer hidden"
                                />
                                <span
                                    className={`w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center 
    ${rememberMe ? 'bg-second-color border-second-color' : ''} transition`}
                                >
                                    {rememberMe && <BiCheck className="w-3 h-3 text-white" />}
                                </span>

                                <span className="text-sm">{t('auth.login.rememberMe')}</span>
                            </label>



                            {/* <label htmlFor="rememberMe" className={`flex justify-center items-center gap-1`}>
                                <input type="checkbox" name="rememberMe" id="rememberMe" />
                                {t('auth.login.rememberMe')}
                            </label> */}
                            {/* <Link to={'/auth/forget-password'} className={`px-4 text-xs text-primary-color opacity-50 transition-all hover:opacity-100`}>{t('auth.login.forgetPassword')}</Link> */}
                        </div>
                    </div>

                </div>
            </div>

        </div>


    )
}

export default Login
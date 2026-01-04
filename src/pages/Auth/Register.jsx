import React, { useState } from 'react'
import Form from '../../components/forms/Form'
import MultipleForm from '../../components/multipleForm/MultipleForm'
import HeroBrand from '../../components/ui/HeroBrand'
import { authService } from '../../services/auth/authService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'



const STEP_ONE_FIELDS = [
    {
        name: 'name',
        type: 'text',
        placeholder: 'اكتب اسمك اللي عايز تتعامل بيه في التطبيق',
        label: 'الأسم بالكامل',
        validation: { required: 'الأسم مطلوب', minLength: { value: 3, message: 'الاسم قصير جداً' } }
    },
    {
        name: 'email',
        type: 'email',
        placeholder: 'اكتب بريد إلكتروني يمكن التحقق منه',
        label: 'البريد الإلكتروني',
        validation: {
            required: 'البريد مطلوب',
            pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: 'صيغة البريد غير صحيحة'
            }
        }
    }
]

const STEP_TWO_FIELDS = [
    {
        name: 'password',
        label: 'كلمة المرور',
        type: 'password',
        placeholder: 'اكتب كلمة المرور',
        validation: {
            required: 'كلمة المرور مطلوبة',
            minLength: {
                value: 6,
                message: 'كلمة المرور يجب ألا تقل عن 6 أحرف'
            }
        },
    },
    {
        name: 'password_confirmation',
        label: 'تأكيد كلمة المرور',
        type: 'password',
        placeholder: 'أعد كتابة كلمة المرور',
        validation: {
            required: 'تأكيد كلمة المرور مطلوب',
        },
    }
]


const STEP_THREE_FIELDS = [

    {
        name: 'initial_balance',
        type: 'text',
        placeholder: 'أدخل رصيد حسابك الحالي (كل اللي معاك)',
        label: 'الرصيد الحالي',
    }
]


const Register = () => {

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        initial_balance: ''

    })


    const onSubmit = async (data) => {
        console.log("✅ Data submitted:", data);
        const res = await authService.register(data);
        console.log(res)
        if (res.status === 200 || res.status === 201) {
            toast.success(`تم تسجيل بياناتك بنجاح , يرجى تأكيد البريد الإلكتروني`);

            navigate(`/auth/verify-otp`, {
                state: {
                    email: data.email
                }
            })

        } else {
            toast.error(`${res.data.data.message}`);

        }
    };

    const handleCancel = () => {

        console.log(`Form is Not Submitted`)
    }

    return (
        <div className={`w-full flex flex-row`}>
            <HeroBrand heroBrandTitle={`مرحبًا بك في سبيندلي`} heroBrandDescription={`من هنا يمكنك تتبع جميع معاملاتك اليومية بذكاء`} />


            <div className={`w-full min-h-screen h-full flex flex-col gap-8 justify-center items-center`}>
                <div className={`w-full flex flex-col justify-center items-center gap-4`}>
                    <p className={`text-2xl font-bold`}>إنشاء حساب جديد</p>
                    <p className={`text-lg`}>إنشئ حسابك واتحكم في معاملاتك اليومية بسهولة من مكان واحد</p>
                </div>

                {/* MultiStep Form Customization */}
                <MultipleForm formData={initialValues} step_one_fields={STEP_ONE_FIELDS} step_two_fields={STEP_TWO_FIELDS} step_one_title={`البيانات الشخصية`} step_two_title={`الأمان وكلمة المرور`} step_three_fields={STEP_THREE_FIELDS} step_three_title={`المعلومات المالية`} onSubmit={onSubmit} />
            </div>

        </div>
    )
}

export default Register
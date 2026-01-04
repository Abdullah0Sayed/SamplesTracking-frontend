import React, { useMemo } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import BreedCrump from '../../../../components/ui/BreedCrump'
import { useTranslation } from 'react-i18next'
import Form from '../../../../components/forms/Form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { testCodesService } from '../../../../services/testCodesService/testCodesService'

const AddTestCode = () => {

    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'code',
            type: 'text',
            placeholder: t('testCodesManagement.testCodesFields.codePlaceHolder'),
            label: t('testCodesManagement.testCodesFields.code'),
            validation: {
                required: 'كود الاختبار مطلوب',
            }
        },
        {

            name: 'name',
            type: 'text',
            placeholder: t('testCodesManagement.testCodesFields.namePlaceHolder'),
            label: t('testCodesManagement.testCodesFields.name'),
            validation: {
                required: 'اسم  "كود" الإختبار مطلوب',

            }
        },

    ], [t, lang]);


    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        code: '',
        name: '',
    }), []);


    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const res = await testCodesService.addTestCode(data);
            toast.success(t('testCodesManagement.addTestCodeSuccessStatus'));
            navigate(-1)
            // console.log(data);
        } catch (error) {
            console.log(error);
            toast.error(t('global.errorProcessingRequest'));
        }
    };


    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
                <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
                <BreedCrump breed_title={t('layouts.sideBar.settings.testCodes')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('testCodesManagement.addTestCode')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('testCodesManagement.addTestCode')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AddTestCode
import React, { useMemo } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import BreedCrump from '../../../../components/ui/BreedCrump'
import { useTranslation } from 'react-i18next'
import Form from '../../../../components/forms/Form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { sampleCodesService } from '../../../../services/sampleCodesService/sampleCodesService'

const AddSampleCode = () => {

    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'code',
            type: 'text',
            placeholder: t('sampleCodesManagement.sampleCodesFields.codePlaceHolder'),
            label: t('sampleCodesManagement.sampleCodesFields.code'),
            validation: {
                required: 'كود العينة مطلوب',
            }
        },
        {
            name: 'name',
            type: 'text',
            placeholder: t('sampleCodesManagement.sampleCodesFields.namePlaceHolder'),
            label: t('sampleCodesManagement.sampleCodesFields.name'),
            validation: {
                required: 'اسم نوع "كود" العنية مطلوب',

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
            const res = await sampleCodesService.addSampleCode(data);
            toast.success(t('sampleCodesManagement.addSampleCodeSuccessStatus'));
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
                <BreedCrump breed_title={t('layouts.sideBar.settings.sampleCodes')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('sampleCodesManagement.addSampleCode')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('sampleCodesManagement.addSampleCode')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AddSampleCode
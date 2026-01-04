import React, { useMemo } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import BreedCrump from '../../../../components/ui/BreedCrump'
import { useTranslation } from 'react-i18next'
import Form from '../../../../components/forms/Form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { laboratoryService } from '../../../../services/laboratory/laboratoryService'


const AddLaboratory = () => {

    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    /** Form Fields */
    const FIELDS = useMemo(() => [

        {
            name: 'name',
            type: 'text',
            placeholder: t('laboratoryManagement.laboratoryFields.namePlaceHolder'),
            label: t('laboratoryManagement.laboratoryFields.name'),
            validation: {
                required: 'اسم الثلاجة مطلوب',

            },
            full_width: true

        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: t('laboratoryManagement.laboratoryFields.descriptionPlaceHolder'),
            label: t('laboratoryManagement.laboratoryFields.description'),
            full_width: true
        },
        {
            name: 'notes',
            type: 'textarea',
            placeholder: t('laboratoryManagement.laboratoryFields.notesPlaceHolder'),
            label: t('laboratoryManagement.laboratoryFields.notes'),
            full_width: true

        },

    ], [t, lang]);


    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        name: '',
        description: '',
        notes: '',
    }), []);


    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const res = await laboratoryService.addLaboratory(data);
            toast.success(t('laboratoryManagement.addLaboratorySuccessStatus'));
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
                <BreedCrump breed_title={t('layouts.sideBar.settings.laboratories')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('laboratoryManagement.addLaboratory')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('laboratoryManagement.addLaboratory')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AddLaboratory
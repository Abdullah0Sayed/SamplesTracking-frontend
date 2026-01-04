import React, { useEffect, useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import BreedCrump from '../../../../components/ui/BreedCrump'
import { useTranslation } from 'react-i18next'
import Form from '../../../../components/forms/Form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { refrigeratorService } from '../../../../services/refrigerators/refrigeratorService'
import useLaboratories from '../../../../hooks/laboratories/useLaboratories'


const AddRefrigerator = () => {

    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();
    const [laboratoriesOptions, setLaboratoriesOptions] = useState([]);
    const { fetchLaboratoriesWithoutPagination } = useLaboratories();


    /** Effect */
    useEffect(() => {
        const loadLaboratories = async () => {
            try {
                const { data } = await fetchLaboratoriesWithoutPagination();
                setLaboratoriesOptions(data?.data?.map((laboratory) => ({ label: laboratory.name, value: laboratory.id })))

            } catch (error) {
                console.log(error)
            }
        }

        loadLaboratories()

    }, [fetchLaboratoriesWithoutPagination]);

    /** Form Fields */
    const FIELDS = useMemo(() => [

        {
            name: 'name',
            type: 'text',
            placeholder: t('refrigeratorManagement.refrigeratorFields.namePlaceHolder'),
            label: t('refrigeratorManagement.refrigeratorFields.name'),
            validation: {
                required: 'اسم الثلاجة مطلوب',

            },
            full_width: true
        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: t('refrigeratorManagement.refrigeratorFields.descriptionPlaceHolder'),
            label: t('refrigeratorManagement.refrigeratorFields.description'),
            full_width: true

        },
        {
            name: 'laboratory_id',
            type: 'single-select',
            placeholder: t('refrigeratorManagement.refrigeratorFields.laboratoryPlaceHolder'),
            label: t('refrigeratorManagement.refrigeratorFields.laboratory'),
            options: laboratoriesOptions,
            validation: {
                required: 'المختبر التابع له الثلاجة مطلوب',

            },
            full_width: true

        },

    ], [t, lang, laboratoriesOptions]);


    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        name: '',
        description: '',
        laboratory_id: ''
    }), []);


    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const res = await refrigeratorService.addRefrigerator(data);
            toast.success(t('refrigeratorManagement.addRefrigeratorSuccessStatus'));
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
                <BreedCrump breed_title={t('layouts.sideBar.settings.refrigerators')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('refrigeratorManagement.addRefrigerator')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('refrigeratorManagement.addRefrigerator')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AddRefrigerator
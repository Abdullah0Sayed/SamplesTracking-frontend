import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import Form from '../../../../components/forms/Form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useRefrigerators from '../../../../hooks/refrigerators/useRefrigerators';
import { refrigeratorService } from '../../../../services/refrigerators/refrigeratorService';
import useLaboratories from '../../../../hooks/laboratories/useLaboratories';
import { laboratoryService } from '../../../../services/laboratory/laboratoryService';


const EditLaboratory = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    const { id } = useParams();

    const { fetchLaboratory } = useLaboratories();
    const [objectRecord, setObjectRecord] = useState(null);

    /** Load admin data */
    useEffect(() => {
        if (!id) return;

        const loadObject = async () => {
            try {
                const { data } = await fetchLaboratory(id);
                console.log(data.data)
                setObjectRecord(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadObject();
    }, [id]);




    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'name',
            type: 'text',
            placeholder: t('laboratoryManagement.laboratoryFields.namePlaceHolder'),
            label: t('laboratoryManagement.laboratoryFields.name'),
            validation: {
                required: 'اسم المختبر مطلوب',
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
        name: objectRecord?.name || '',
        description: objectRecord?.description || '',
        notes: objectRecord?.notes || '',

    }), [objectRecord]);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const payload = { id: objectRecord?.id, ...data }

            const res = await laboratoryService.updateLaboratory(payload);
            toast.success(`${t('global.successUpdateProcessingRequest')}`);
            navigate(-1)
        } catch (error) {
            console.error(error);
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
                    {t('laboratoryManagement.editLaboratory')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('global.save')}
                    showCancelBtn={true}
                    onSubmit={onSubmit}
                    onCancel={() => navigate(-1)}
                    enableReinitialize={true}
                />
            </div>
        </div>
    );
}

export default EditLaboratory
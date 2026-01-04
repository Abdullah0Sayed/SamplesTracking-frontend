import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import Form from '../../../../components/forms/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useTestCodes from '../../../../hooks/testCodes/useTestCodes';
import { testCodesService } from '../../../../services/testCodesService/testCodesService';


const EditTestCode = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();
    const location = useLocation();
    const recordId = location.pathname.split("/").slice(-2, -1).join("");

    const { fetchTestCode } = useTestCodes();
    const [objectRecord, setObjectRecord] = useState(null);

    /** Load admin data */
    useEffect(() => {
        if (!recordId) return;

        const loadObject = async () => {
            try {
                const { data } = await fetchTestCode(recordId);
                console.log(data.data)
                setObjectRecord(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadObject();
    }, [recordId]);




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
        name: objectRecord?.name || '',
        code: objectRecord?.code || '',

    }), [objectRecord]);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const payload = { id: objectRecord?.id, ...data }

            const res = await testCodesService.updateTestCode(payload);
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
                <BreedCrump breed_title={t('layouts.sideBar.settings.testCodes')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('testCodesManagement.editTestCode')}
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

export default EditTestCode
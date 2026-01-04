import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/forms/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useSamples from '../../../hooks/samples/useSamples';
import { sampleService } from '../../../services/samples/sampleService';
import useWorkflows from '../../../hooks/workflows/useWorkflows';
import useSampleCodes from '../../../hooks/sampleCodes/useSampleCodes';

const EditSample = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();
    const { id } = useParams();

    const { fetchSample } = useSamples();
    const [objectRecord, setObjectRecord] = useState(null);

    const { workflows } = useWorkflows();
    const { sampleCodes } = useSampleCodes();

    const qcStatusOptions = useMemo(() => [
        { label: 'pending', value: 'pending' },
        { label: 'accepted', value: 'accepted' },
        { label: 'rejected', value: 'rejected' },
    ], []);
    const sampleConditionsOptions = useMemo(() => ([
        { label: 'سليمة', value: 'سليمة' },
        { label: 'غير صالحة', value: 'غير صالحة' },
    ]), []);



    /** Load sample data */
    useEffect(() => {
        if (!id) return;
        const loadObject = async () => {
            try {
                const { data } = await fetchSample(id);
                setObjectRecord(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        loadObject();
    }, [id]);


    const [qcStatusValue, setQcStatusValue] = useState("");

    useEffect(() => {
        if (objectRecord?.qc_status) {
            setQcStatusValue(objectRecord.qc_status);
        }
    }, [objectRecord]);


    /** Options from hooks data */
    const sampleCodesOptions = useMemo(() =>
        sampleCodes?.map(sc => ({ value: sc.id, label: sc.code })) || [],
        [sampleCodes]
    );

    const workflowsOptions = useMemo(() =>
        workflows?.map(wf => ({ value: wf.id, label: wf.code })) || [],
        [workflows]
    );

    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'serial_name',
            type: 'text',
            placeholder: t('samplesManagement.samplesFields.serialNamePlaceHolder'),
            label: t('samplesManagement.samplesFields.serialName'),
            validation: { required: 'كود العينة مطلوب' }
        },
        {
            name: 'qc_status',
            type: 'single-select',
            placeholder: t('samplesManagement.samplesFields.qcStatusPlaceHolder'),
            label: t('samplesManagement.samplesFields.qcStatus'),
            options: qcStatusOptions,
            validation: { required: 'حالة اختبار الجودة مطلوب' },
            onChange: (value) => {
                console.log(value)
                setQcStatusValue(value);
            }

        },

        qcStatusValue === 'rejected' ? {
            name: 'reject_reason',
            type: 'textarea',
            placeholder: t('samplesManagement.samplesFields.rejectReasonPlaceHolder'),
            label: t('samplesManagement.samplesFields.rejectReason'),
            validation: { required: 'سبب الرفض مطلوب' }
        } : null,
        {
            name: 'sample_condition',
            type: 'single-select',
            label: t('samplesManagement.samplesFields.sampleCondition'),
            placeholder: t('samplesManagement.samplesFields.sampleConditionPlaceHolder'),
            options: sampleConditionsOptions,
            validation: {
                required: 'حالة العينة مطلوب',
            },
            full_width: true
        },
        {
            name: 'received_from',
            type: 'text',
            label: t('samplesManagement.samplesFields.receivedFrom'),
            placeholder: t('samplesManagement.samplesFields.receivedFromPlaceHolder'),
            validation: {
                required: 'اسم الجهة المستلم منها العينة مطلوب',
            }
        },
        {
            name: 'received_by',
            type: 'text',
            label: t('samplesManagement.samplesFields.receivedBy'),
            placeholder: t('samplesManagement.samplesFields.receivedByPlaceHolder'),
            validation: {
                required: 'اسم مستلم العينة مطلوب',
            }
        },
        {
            name: 'sample_code_id',
            type: 'single-select',
            placeholder: t('samplesManagement.samplesFields.sampleCodePlaceHolder'),
            label: t('samplesManagement.samplesFields.sampleCode'),
            options: sampleCodesOptions,
            validation: { required: 'رمز الأختبار مطلوب' }
        },
        {
            name: 'workflow_id',
            type: 'single-select',
            placeholder: t('samplesManagement.samplesFields.workflowPlaceHolder'),
            label: t('samplesManagement.samplesFields.workflow'),
            options: workflowsOptions,
            validation: { required: 'مسار العمل مطلوب' }
        }

    ].filter(Boolean), [t, sampleCodesOptions, sampleConditionsOptions, workflowsOptions, qcStatusOptions, qcStatusValue]);

    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        serial_name: objectRecord?.serial_name || '',
        qc_status: objectRecord?.qc_status || '',
        sample_code_id: objectRecord?.sample_code?.id || '',
        workflow_id: objectRecord?.workflow?.id || '',
        reject_reason: objectRecord?.reject_reason || '',
        received_from: objectRecord?.received_from || '',
        received_by: objectRecord?.received_by || '',
        sample_condition: objectRecord?.sample_condition || ''

    }), [objectRecord]);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            console.log(data)
            await sampleService.updateSample({ id: objectRecord?.id, ...data });
            toast.success(t('global.successUpdateProcessingRequest'));
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
                <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
                <BreedCrump breed_title={t('layouts.sideBar.samples')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('samplesManagement.editSample')}
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

export default EditSample;

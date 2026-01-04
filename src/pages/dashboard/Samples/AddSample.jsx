import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useWorkflows from '../../../hooks/workflows/useWorkflows';
import BreedCrump from '../../../components/ui/BreedCrump';
import Form from '../../../components/forms/Form';
import { sampleService } from '../../../services/samples/sampleService';
import { workflowService } from '../../../services/workflows/workflowService';

const AddSample = () => {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const lang = useSelector(state => state.webLanguage);

    /** ------------------ DATA ------------------ */
    const { fetchWorkflowsWithoutPagination } = useWorkflows();

    const [sampleCodesOptions, setSampleCodeOptions] = useState([]);
    const [workflowsOptions, setWorkflowsOptions] = useState([]);
    const [selectedWorkflowID, setSelectedWorkflowID] = useState(null);
    const [loadingSampleCodes, setLoadingSampleCodes] = useState(false);

    /** ------------------ STATIC OPTIONS ------------------ */
    const qcStatusOptions = useMemo(() => ([
        { label: 'pending', value: 'pending' },
        { label: 'accepted', value: 'accepted' },
        // { label: 'rejected', value: 'rejected' },
    ]), []);
    const sampleConditionsOptions = useMemo(() => ([
        { label: 'سليمة', value: 'سليمة' },
        { label: 'غير صالحة', value: 'غير صالحة' },
    ]), []);



    /** ------------------ FETCH SAMPLE CODES ------------------ */
    const fetchWorkflowByID = async (id) => {
        try {
            setLoadingSampleCodes(true);

            const { data } = await workflowService.getWorkflow(id);

            const options =
                data?.data?.sample_codes?.map(sc => ({
                    value: sc.id,
                    label: sc.code
                })) || [];

            setSampleCodeOptions(options);
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        } finally {
            setLoadingSampleCodes(false);
        }
    };

    /** ------------------ EFFECT ------------------ */

    useEffect(() => {
        const loadWorkflows = async () => {
            try {
                const { data } = await fetchWorkflowsWithoutPagination();
                setWorkflowsOptions(data?.data?.map(wf => ({
                    value: wf.id,
                    label: wf.code
                })) || [],)
            } catch (error) {
                console.log(error)
            }
        }

        loadWorkflows()
    }, []);

    useEffect(() => {
        if (selectedWorkflowID) {
            fetchWorkflowByID(selectedWorkflowID);
        } else {
            setSampleCodeOptions([]);
        }
    }, [selectedWorkflowID]);

    /** ------------------ FORM FIELDS ------------------ */
    const FIELDS = useMemo(() => ([
        {
            name: 'serial_name',
            type: 'text',
            label: t('samplesManagement.samplesFields.serialName'),
            placeholder: t('samplesManagement.samplesFields.serialNamePlaceHolder'),
            validation: {
                required: 'العينة مطلوبة',
            }
        },
        {
            name: 'qc_status',
            type: 'single-select',
            label: t('samplesManagement.samplesFields.qcStatus'),
            placeholder: t('samplesManagement.samplesFields.qcStatusPlaceHolder'),
            options: qcStatusOptions,
            validation: {
                required: 'حالة اختبار الجودة مطلوب',
            }
        },
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
            name: 'workflow_id',
            type: 'single-select',
            label: t('samplesManagement.samplesFields.workflow'),
            placeholder: t('samplesManagement.samplesFields.workflowPlaceHolder'),
            options: workflowsOptions,
            validation: {
                required: 'مسار العمل مطلوب',
            },
            onChange: (value, setValue) => {
                setSelectedWorkflowID(value);
                setValue('sample_code_id', '');
            }
        },
        {
            name: 'sample_code_id',
            type: 'single-select',
            label: t('samplesManagement.samplesFields.sampleCode'),
            placeholder: t('samplesManagement.samplesFields.sampleCodePlaceHolder'),
            options: sampleCodesOptions,
            validation: {
                required: 'رمز الأختبار مطلوب',
            },
            isDisabled: !selectedWorkflowID || loadingSampleCodes
        }
    ]), [
        t,
        qcStatusOptions,
        sampleConditionsOptions,
        workflowsOptions,
        sampleCodesOptions,
        selectedWorkflowID,
        loadingSampleCodes
    ]);

    /** ------------------ INITIAL VALUES ------------------ */
    const INITIAL_VALUES = useMemo(() => ({
        serial_name: '',
        qc_status: '',
        workflow_id: '',
        sample_code_id: '',
        received_from: '',
        received_by: '',
        sample_condition: '',
    }), []);

    /** ------------------ SUBMIT ------------------ */
    const onSubmit = async (data) => {
        try {
            await sampleService.addSample(data);
            toast.success(t('samplesManagement.addSampleSuccessStatus'));
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        }
    };

    /** ------------------ UI ------------------ */
    return (
        <div className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-row gap-2 items-center">
                <FaArrowRight
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                />
                <BreedCrump
                    breed_title={t('layouts.sideBar.settings.sampleCodes')}
                />
            </div>

            {/* Form Card */}
            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('samplesManagement.addSample')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('samplesManagement.addSample')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default AddSample;

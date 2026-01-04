import React, { useEffect, useMemo } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import Select from 'react-select';
import { BiPlus, BiTrash } from 'react-icons/bi';
import { workflowService } from '../../../../services/workflows/workflowService';
import useSampleCodes from '../../../../hooks/sampleCodes/useSampleCodes';
import useTestCodes from '../../../../hooks/testCodes/useTestCodes';

const EditWorkflow = () => {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = useSelector(state => state.webLanguage);

    /** Hooks from react-hook-form */
    const { register, control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {
            code: '',
            name: '',
            sample_codes: [],
            workflow_test_code_steps: [{ test_code_id: "", step_order: "" }]
        }
    });

    /** FieldArray for workflow steps */
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workflow_test_code_steps"
    });

    /** Fetch Sample Codes */
    const { sampleCodes } = useSampleCodes();
    const sampleCodesOptions = useMemo(() => {
        if (sampleCodes) return sampleCodes.map(sc => ({ label: sc.code, value: sc.id }));
        return [];
    }, [sampleCodes]);

    /** Fetch Test Codes */
    const { testCodes } = useTestCodes();
    const testCodesOptions = useMemo(() => {
        if (testCodes) return testCodes.map(tc => ({ label: tc.code, value: tc.id }));
        return [];
    }, [testCodes]);

    /** Load Workflow Object */
    useEffect(() => {
        if (!id) return;

        const fetchWorkflow = async () => {
            try {
                const { data } = await workflowService.getWorkflow(id);
                const workflow = data.data;

                reset({
                    code: workflow.code,
                    name: workflow.name,
                    sample_codes: workflow.sample_codes.map(sc => sc.id),
                    workflow_test_code_steps: workflow.test_codes_steps.map(step => ({
                        test_code_id: step.test_code_id,
                        step_order: step.step_order
                    }))
                });
            } catch (error) {
                console.error(error);
                toast.error(t('global.errorProcessingRequest'));
            }
        };

        fetchWorkflow();
    }, [id, reset, t]);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            console.log(data)
            const payload = { id, ...data };
            console.log(payload)
            await workflowService.updateWorkflow(payload);
            toast.success(t('global.successUpdateProcessingRequest'));
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        }
    };

    return (
        <div className={`w-full flex flex-col gap-4`}>
            <div className={`flex flex-row gap-2 items-center`}>
                <FaArrowRight onClick={() => navigate(-1)} className={`cursor-pointer`} />
                <BreedCrump breed_title={t('layouts.sideBar.settings.sampleCodes')} />
            </div>

            <div className={`w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md`}>
                <p className={`text-2xl px-4 font-semibold text-black`}>
                    {t('workflowsManagement.editWorkflow')}
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`w-full grid grid-cols-2 gap-4 p-4`}>

                        {/* Code Field */}
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-sm`}>{t('workflowsManagement.workflowsFields.code')}</label>
                            <input
                                type="text"
                                {...register('code')}
                                placeholder={t('workflowsManagement.workflowsFields.codePlaceHolder')}
                                className={`w-full border rounded-md px-4 py-2`}
                            />
                        </div>

                        {/* Name Field */}
                        <div className={`flex flex-col gap-2`}>
                            <label className={`text-sm`}>{t('workflowsManagement.workflowsFields.name')}</label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder={t('workflowsManagement.workflowsFields.namePlaceHolder')}
                                className={`w-full border rounded-md px-4 py-2`}
                            />
                        </div>

                        {/* Sample Codes Multi-Select */}
                        <div className={`col-span-2 flex flex-col gap-2`}>
                            <label className={`text-sm`}>{t('workflowsManagement.workflowsFields.sampleCodes')}</label>
                            <Select
                                isMulti
                                options={sampleCodesOptions}
                                value={sampleCodesOptions.filter(option =>
                                    watch('sample_codes')?.includes(option.value)
                                )}
                                onChange={(selected) => {
                                    setValue('sample_codes', selected ? selected.map(s => s.value) : []);
                                }}
                                placeholder={t('workflowsManagement.workflowsFields.sampleCodesPlaceHolder')}
                                className={`react-select-container`}
                                classNamePrefix={`react-select`}
                                isClearable
                            />
                        </div>

                        {/* Test Code Steps */}
                        <div className={`col-span-2 flex flex-col gap-4 mt-4`}>
                            {fields.map((field, index) => (
                                <div key={field.id} className={`flex gap-4 items-end`}>
                                    {/* Test Code Single Select */}
                                    <div className={`flex-1`}>
                                        <label className={`text-sm`}>{t('workflowsManagement.workflowsFields.testCode')}</label>
                                        <Select
                                            options={testCodesOptions}
                                            value={testCodesOptions.find(opt =>
                                                opt.value === watch(`workflow_test_code_steps.${index}.test_code_id`)
                                            )}
                                            onChange={(selected) =>
                                                setValue(`workflow_test_code_steps.${index}.test_code_id`, selected?.value || '')
                                            }
                                            placeholder={t('workflowsManagement.workflowsFields.testCodePlaceHolder')}
                                            className={`react-select-container`}
                                            classNamePrefix={`react-select`}
                                            isClearable
                                        />
                                    </div>

                                    {/* Step Order */}
                                    <div className={`flex-1`}>
                                        <label className={`text-sm`}>{t('workflowsManagement.workflowsFields.stepOrder')}</label>
                                        <input
                                            type="number"
                                            {...register(`workflow_test_code_steps.${index}.step_order`)}
                                            placeholder={t('workflowsManagement.workflowsFields.stepOrderPlaceHolder')}
                                            className={`w-full border rounded-md px-3 py-2`}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    {index === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => append({ test_code_id: "", step_order: "" })}
                                            className={`w-8 h-8 flex items-center justify-center bg-grey-2 text-grey-4 rounded-md`}
                                        >
                                            <BiPlus />
                                        </button>
                                    )}
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className={`w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-md`}
                                        >
                                            <BiTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className={`p-4`}>
                        <button type="submit" className={`px-4 py-2 bg-primary-color text-white rounded-md`}>
                            {t('global.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWorkflow;

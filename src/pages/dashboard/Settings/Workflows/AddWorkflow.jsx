import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useFieldArray, useForm } from 'react-hook-form';
import useSampleCodes from '../../../../hooks/sampleCodes/useSampleCodes';
import useTestCodes from '../../../../hooks/testCodes/useTestCodes';
import Select from 'react-select';
import { BiPlus, BiTrash } from 'react-icons/bi';
import { workflowService } from '../../../../services/workflows/workflowService';

const AddWorkflow = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    const [sampleCodesOptions, setSampleCodesOptions] = useState([]);
    const [testCodesOptions, setTestCodesOptions] = useState([]);

    /** Hooks from react-hook-form */
    const { register, control, handleSubmit, watch, setValue } = useForm({
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
    const { fetchSampleCodesWithoutPagination } = useSampleCodes();
    /** Fetch Test Codes */
    const { fetchTestCodesWithoutPagination } = useTestCodes();

    /** Effect */
    useEffect(() => {
        const loadSampleCodes = async () => {
            try {
                const { data } = await fetchSampleCodesWithoutPagination();
                setSampleCodesOptions(data?.data?.map(sc => ({ label: sc.code, value: sc.id })))
            } catch (error) {
                console.log(error)
            }
        }

        const loadTestCodes = async () => {
            try {
                const { data } = await fetchTestCodesWithoutPagination();
                setTestCodesOptions(data?.data?.map(tc => ({ label: tc.code, value: tc.id })))
            } catch (error) {
                console.log(error)
            }
        }

        loadSampleCodes();
        loadTestCodes();
    }, []);





    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            const res = await workflowService.addWorkflow(data);
            toast.success(t('workflowsManagement.addWorkflowSuccessStatus'));
            navigate(-1);
        } catch (error) {
            console.log(error);
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
                    {t('workflowsManagement.addWorkflow')}
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
                                isClearable
                                options={sampleCodesOptions}
                                placeholder={t('workflowsManagement.workflowsFields.sampleCodesPlaceHolder')}
                                value={sampleCodesOptions.filter(option =>
                                    watch('sample_codes')?.includes(option.value)
                                )}
                                onChange={(selected) => {
                                    setValue('sample_codes', selected ? selected.map(s => s.value) : []);
                                }}
                                className={`react-select-container`}
                                classNamePrefix={`react-select`}
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
                                            value={testCodesOptions.find(option => option.value === watch(`workflow_test_code_steps.${index}.test_code_id`))}
                                            onChange={(selected) => setValue(`workflow_test_code_steps.${index}.test_code_id`, selected?.value || '')}
                                            placeholder={t('workflowsManagement.workflowsFields.testCodePlaceHolder')}
                                            isClearable
                                            className={`react-select-container`}
                                            classNamePrefix={`react-select`}
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
                                    {index == 0 && (<button
                                        type="button"
                                        onClick={() => append({ test_code_id: "", step_order: "" })}
                                        className={`w-8 h-8 flex items-center justify-center bg-grey-2 text-grey-4 rounded-md`}
                                    >
                                        <BiPlus className={``} />
                                        {/* {t('workflowsManagement.addNewRecord')} */}
                                    </button>)}

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

export default AddWorkflow;

import React, { useState } from 'react'
import Step from './steps/Step';
import ProgressBar from '../ui/ProgressBar';
import { FormProvider, useForm } from 'react-hook-form';
import Review from './review/Review';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';

const MultipleForm = ({ step_one_fields, step_two_fields, formData, step_one_title, step_two_title, step_three_title, step_three_fields, onSubmit }) => {

    const methods = useForm({
        defaultValues: formData,
        mode: "onChange"
    });

    const total_steps = 4;
    const [step, setStep] = useState(1);



    const { trigger } = methods;

    const handleNextStep = async () => {
        let fieldsToValidate = [];

        if (step === 1) fieldsToValidate = ['name', 'email'];
        if (step === 2) fieldsToValidate = ['password', 'password_confirmation'];
        if (step === 3) fieldsToValidate = ['balance'];


        const isValid = await trigger(fieldsToValidate);

        if (isValid) setStep(step + 1);
    };

    const renderSteps = () => {
        switch (step) {
            case 1:
                return <Step fields={step_one_fields} step_title={step_one_title} />;
            case 2:
                return <Step fields={step_two_fields} step_title={step_two_title} />;
            case 3:
                return <Step fields={step_three_fields} step_title={step_three_title} />;
            case 4:
                return <Review />;
            default:
                return null;
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full flex place-content-center">
                <div className="w-3/4 rounded-md p-4 flex flex-col gap-4 justify-center items-center">
                    {renderSteps()}

                    <div className="w-full flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-1 flex flex-row gap-1 justify-center items-center rounded-md border border-grey-7 text-primary-color"
                            >
                                <BsArrowRightCircle className="text-lg" />
                                السابق
                            </button>
                        )}

                        {step < total_steps ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="px-6 py-1 flex flex-row gap-1 justify-center items-center rounded-md border border-primary-color text-primary-color"
                            >
                                التالي
                                <BsArrowLeftCircle className="text-lg" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-1 border border-third-color text-third-color rounded-md"
                            >
                                تأكيد
                            </button>
                        )}
                    </div>

                    <ProgressBar step={step} total_steps={total_steps} />
                </div>
            </form>
        </FormProvider>
    );
};

export default MultipleForm;

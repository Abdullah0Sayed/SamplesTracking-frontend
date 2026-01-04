import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { BsEye } from 'react-icons/bs';

const Step = ({ fields, step_title }) => {
    const { register, watch, formState: { errors } } = useFormContext();

    const passwordValue = watch('password');


    const [passwordVisibility, setPasswordVisibility] = useState({});

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName] === 'text' ? 'password' : 'text'
        }));
    };

    return (
        <div className="w-full grid gap-4">
            <div className="w-full">
                <p className="text-xl font-semibold">{step_title}</p>
            </div>

            {fields.map((field, index) => {
                if (!['single-select', 'multiple-select'].includes(field.type)) {
                    const validation = { ...field.validation };

                    if (field.name === 'password_confirmation') {
                        validation.validate = (value) =>
                            value === passwordValue || "كلمتا المرور غير متطابقتين";
                    }

                    return (
                        <div key={index} className={`${field.full_width ? 'col-span-2' : 'flex flex-col gap-2'}`}>
                            <label className="text-sm" htmlFor={field.name}>{field.label}</label>

                            {field.type === 'password' ? (
                                <div className="relative flex flex-row justify-between items-center">
                                    <input
                                        type={passwordVisibility[field.name] || 'password'}
                                        name={field.name}
                                        id={field.name}
                                        {...register(field.name, validation)}
                                        placeholder={field.placeholder}
                                        minLength={field.min_length}
                                        maxLength={field.max_length}
                                        className="w-full border rounded-md outline-none focus:border-2 focus:border-primary-color px-4 py-2 transition-all text-sm"
                                    />
                                    <BsEye
                                        className="cursor-pointer text-primary-color absolute left-4 top-1/2 -translate-y-1/2"
                                        onClick={() => togglePasswordVisibility(field.name)}
                                    />
                                </div>
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    id={field.name}
                                    {...register(field.name, validation)}
                                    placeholder={field.placeholder}
                                    minLength={field.min_length}
                                    maxLength={field.max_length}
                                    className="w-full border rounded-md px-4 py-2 outline-none focus:border-2 focus:border-primary-color transition-all text-sm"
                                />
                            )}

                            {errors[field.name] && (
                                <p className="text-xs text-red-600 bg-red-100 rounded-lg py-2 px-2">
                                    {errors[field.name].message}
                                </p>
                            )}
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default Step

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { citiesService } from "../../../services/citiesService";

const AddCityModal = ({onCancel , onAdd}) => {
  const lang = useSelector((state) => state.webLanguage);
  const { t } = useTranslation("global");

    {/** Initialaize Form */}
  const { register, control, handleSubmit, trigger, reset, getValues , formState: {errors} } =
    useForm({
      defaultValues: { cities: [{ name_ar: "", name_en: "" }] },
    });

    {/** Initialaize array Fields */}
  const { fields, append, remove } = useFieldArray({ control, name: "cities" });



 const onSubmit = async (formData) => {
    
    try {
      const payload = formData.cities[0];
      const res = await citiesService.addCity(payload);
      toast.success(t('global.successAddProcessingRequest'))
      onCancel();
       onAdd();
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(t('global.errorProcessingRequest'));
    }
  }
  return (
    <div className={`flex flex-col gap-4`}>
      <p className={`text-2xl font-semibold`}>{t("cities.addCity")} </p>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
      {
        fields.map((field , index) => (
           <div key={field.id} className={`grid grid-cols-[1fr,1fr,auto,auto] gap-2 my-2`}>
                <input placeholder={t('cities.fields.cityNameArPlaceholder')} defaultValue={field.name_ar} {...register(`cities.${index}.name_ar` , { required: t('cities.fields.validation.cityNameArRequired')})}                                                 className={`w-full border rounded-md outline-none focus:border-2 focus:border-primary-color px-4 py-2 transition-all text-sm`}/>
                {errors.cities?.[index]?.name_ar && (
  <p className="text-red-500 text-xs">{errors.cities[index].name_ar.message}</p>
)}
                <input placeholder={t('cities.fields.cityNameEnPlaceholder')} defaultValue={field.name_en} {...register(`cities.${index}.name_en` , { required: t('cities.fields.validation.cityNameEnRequired')})}                                                 className={`w-full border rounded-md outline-none focus:border-2 focus:border-primary-color px-4 py-2 transition-all text-sm`}/>
                 {errors.cities?.[index]?.name_en && (
  <p className="text-red-500 text-xs">{errors.cities[index].name_en.message}</p>
)}
                {
                    index === 0 && <button type="button"  className={`hover:scale-95 transition bg-primary-color rounded-xl text-white w-36 h-12 flex flex-row items-center justify-center gap-1`} onClick={() => append({name_ar: '' , name_en: ''})}>
                                            <BiPlus />
                                            {t('global.add')}
                                        </button>
                }
                {
                    index >= 1 && <button type="button" className={`hover:scale-95 transition bg-grey-8 rounded-xl text-grey-5 p-4 flex flex-row items-center justify-center gap-1`} onClick={() => remove(index)} >
                                            <BiTrash className={`text-xl`}/>
                                        </button>
                }
           </div>
         
        ))
      }
         {/* Action Buttons */}
            <div className={`w-full flex flex-row justify-center items-center gap-4`}>
                <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`} type='button' 
                onClick={() => {reset(); onCancel()}}

>{t('global.cancel')}</button>
                <button className={`w-full px-4 py-2 bg-primary-color text-white rounded-md text-center hover:scale-95 transition-all`}  type='submit'>{t('global.save')}</button>
            </div>
      </form>
    </div>
  );
};

export default AddCityModal;

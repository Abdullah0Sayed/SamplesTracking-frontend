import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsEye, BsEyeSlash, BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import Select from "react-select";

const Form = ({
  fields,
  initial_values,
  onSubmit,
  onCancel,
  submit_label,
  showCancelBtn,
  gridLayout = "grid-cols-1",
}) => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);

  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (initial_values) reset(initial_values);
  }, [initial_values, reset]);

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === "text" ? "password" : "text",
    }));
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-8 p-4"
    >
      <div className={`w-full grid ${gridLayout} gap-4`}>
        {fields.map((field, index) => {
          // ---------- SINGLE SELECT ----------
          if (field.type === "single-select") {
            return (
              <div
                key={index}
                className={`${field.full_width ? "col-span-2" : "flex flex-col gap-4"}`}
              >
                <label htmlFor={field.name}>{field.label}</label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: fi }) => (
                    <Select
                      {...fi}
                      options={field.options || []}
                      placeholder={field.placeholder || `أختر ${field.label}`}
                      onChange={(selected) => {
                        const value = selected ? selected.value : "";
                        fi.onChange(value);
                        if (field.onChange) field.onChange(value, setValue);
                      }}
                      isClearable
                      value={(field.options || []).find(
                        (opt) => opt.value === fi.value,
                      )}
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "0.875rem",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 10,
                          direction: "rtl",
                        }),
                      }}
                    />
                  )}
                />
              </div>
            );
          }

          // ---------- MULTI SELECT ----------
          if (field.type === "multiple-select") {
            return (
              <div key={field.name}>
                <label className="block mb-1">{field.label}</label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: fi }) => (
                    <Select
                      {...fi}
                      isMulti
                      options={field.options}
                      placeholder={field.placeholder || `اختر ${field.label}`}
                      onChange={(selected) => {
                        const values = selected.map((opt) => opt.value);
                        fi.onChange(values);
                        if (field.onChange) field.onChange(values, setValue);
                      }}
                      value={field.options.filter((opt) =>
                        fi.value?.includes(opt.value),
                      )}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "44px",
                          direction: "rtl",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 10,
                          direction: "rtl",
                        }),
                      }}
                    />
                  )}
                />
              </div>
            );
          }

          // ---------- OTHER INPUTS ----------
          const validation = { ...field.validation };

          return (
            <div
              key={index}
              className={`${field.full_width ? "col-span-2" : "flex flex-col gap-4"}`}
            >
              <label className="text-sm" htmlFor={field.name}>
                {field.label}
              </label>

              {/* ---------- PASSWORD ---------- */}
              {field.type === "password" ? (
                <div className="relative">
                  <input
                    type={passwordVisibility[field.name] || "password"}
                    {...register(field.name, validation)}
                    placeholder={field.placeholder}
                    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                  />
                  {passwordVisibility[field.name] === "text" ? (
                    <BsEye
                      className={`absolute cursor-pointer ${lang === "en" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
                      onClick={() => togglePasswordVisibility(field.name)}
                    />
                  ) : (
                    <BsEyeSlash
                      className={`absolute cursor-pointer ${lang === "en" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2`}
                      onClick={() => togglePasswordVisibility(field.name)}
                    />
                  )}
                </div>
              ) : /* ---------- FILE INPUT ---------- */
              field.type === "file" ? (
                <div className="relative">
                  <input
                    type="file"
                    id={field.name}
                    className="hidden"
                    {...register(field.name, validation)}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      register(field.name).onChange(e);
                      setUploadedFile(file);

                      if (field.onChange) field.onChange(file);
                    }}
                  />

                  <label
                    htmlFor={field.name}
                    className="w-full border rounded-md px-4 py-2 flex justify-between items-center cursor-pointer"
                  >
                    {/* اسم الملف + زر الحذف */}
                    <span className="flex items-center gap-2">
                      {uploadedFile ? (
                        <>
                          <BsTrash
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
                              setValue(field.name, null);
                              const input = document.getElementById(field.name);
                              if (input) input.value = "";
                            }}
                          />
                          {uploadedFile.name}
                        </>
                      ) : (
                        t("global.notUploadedFile")
                      )}
                    </span>

                    <span className="bg-primary-color text-white rounded-lg px-2 py-1">
                      {field.label}
                    </span>
                  </label>
                </div>
              ) : /* ---------- TEXTAREA ---------- */
              field.type === "textArea" ? (
                <textarea
                  {...register(field.name, validation)}
                  placeholder={field.placeholder}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                ></textarea>
              ) : field.name === "phone" ? (
                <div className={`relative flex justify-between w-full  `}>
                  <input
                    type={field.type}
                    {...register(field.name, {
                      validation,
                      onChange: (e) =>
                        (e.target.value = e.target.value.replace(/\D/, "")),
                    })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:shadow"
                  />
                  <div
                    className={`absolute w-16 h-full ${lang === "en" ? "right-0" : "left-0"} flex justify-center items-center text-grey-5 border rounded `}
                  >
                    +966
                  </div>
                </div>
              ) : (
                /* ---------- NORMAL INPUT ---------- */
                <input
                  type={field.type}
                  {...register(field.name, validation)}
                  placeholder={field.placeholder}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-red-600 bg-red-100 rounded-lg py-2 px-2">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- ACTION BUTTONS ---------- */}
      <div className="w-full flex justify-center gap-4">
        {showCancelBtn && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-grey-2 text-grey-5 rounded-md hover:scale-95 transition-all"
          >
            إلغاء
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-primary-color text-white rounded-md hover:scale-95 transition-all"
        >
          {isSubmitting ? "جارٍ التحميل..." : submit_label}
        </button>
      </div>
    </form>
  );
};

export default Form;

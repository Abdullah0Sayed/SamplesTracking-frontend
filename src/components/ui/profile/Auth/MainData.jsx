import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "../../../forms/Form";
import { authService } from "../../../../services/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../toolkit/slicers/AuthSlicer";
import { BiPencil, BiTrash } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";

const MainData = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [authedUser, setAuthedUser] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const imageRef = useRef([]);

  const FIELDS = [
    {
      name: "name",
      label: t("settings.editMyProfile.name"),
      type: "text",
      placeholder: t("settings.editMyProfile.namePlaceHolder"),
      validation: {
        required: "الاسم مطلوب",
      },
    },

    {
      name: "phone",
      label: t("settings.editMyProfile.phone"),
      type: "text",
      placeholder: t("settings.editMyProfile.phonePlaceHolder"),
      validation: {
        required: "رقم الهاتف مطلوب",
        pattern: {
          value: /^966\d{9}$/,
          message: "رقم الهاتف يجب أن يبدأ بـ 966 ويتبعه 9 أرقام",
        },
      },
    },
  ];

  const fetchAuthedUser = async (user) => {
    try {
      if (!user) return;
      const { data } = await authService.me();
      console.log(data?.data);
      setAuthedUser(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuthedUser(user);
  }, []);

  const INITIAL_VALUES = {
    id: authedUser?.id || "",
    name: authedUser?.name || "",
    phone: authedUser?.phone || "",
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("image", uploadedFile ?? null);
        console.log(formData.get("image"));
        const res = await authService.updateUserProfileImage(formData);

        console.log(`Res From Update Profile Image`);
        console.log(res);
      } else {
        const payload = {
          ...data,
          id: authedUser?.id,
        };

        const res = await authService.updateUserProfile(payload);

        console.log(`Res From Update Profile`);
        console.log(res);
      }

      toast.success(`${t("settings.editMyProfile.successUpdateProfile")}`);
    } catch (error) {
      console.log(error);
      toast.error(`${t("settings.editMyProfile.failedUpdateProfile")}`);
    }
  };

  return (
    <div className={`flex flex-row flex-1 items-center justify-between`}>
      <Form
        gridLayout="grid-cols-1"
        fields={FIELDS}
        initial_values={INITIAL_VALUES}
        submit_label={t("global.save")}
        onSubmit={onSubmit}
        showCancelBtn={true}
      />
    </div>
  );
};

export default MainData;

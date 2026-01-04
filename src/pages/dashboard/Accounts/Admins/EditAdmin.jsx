import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import Form from '../../../../components/forms/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import useRoles from '../../../../hooks/roles/useRoles';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useAdmins from '../../../../hooks/accounts/useAdmins';
import { adminsService } from '../../../../services/accounts/adminsService';

const EditAdmin = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();
    const location = useLocation();
    const adminId = location.pathname.split("/").slice(-2, -1).join("");

    const [admin, setAdmin] = useState(null);
    const [adminSelectedRole, setAdminSelectedRole] = useState(null);

    const { roles } = useRoles();
    const { fetchAdmin } = useAdmins();

    /** Load admin data */
    useEffect(() => {
        if (!adminId) return;

        const loadAdmin = async () => {
            try {
                const { data } = await fetchAdmin(adminId);
                setAdmin(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadAdmin();
    }, [adminId, fetchAdmin]);

    /** Prepare roles options */
    const rolesOptions = useMemo(() => {
        if (!roles || roles.length === 0) return [];
        console.log(roles)
        return roles.map(role => ({
            value: role.id,
            label: role.name,
        }));
    }, [roles]);

    /** Update selected role when admin loads */
    useEffect(() => {
        if (admin?.role) {
            setAdminSelectedRole(prev => {
                if (prev?.value !== admin.role.id) {
                    return { label: admin.role.name, value: admin.role.id };
                }
                console.log(admin)
                return prev;
            });
        }
    }, [admin]);

    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'name',
            type: 'text',
            placeholder: t('accountsManagement.adminFields.namePlaceHolder'),
            label: t('accountsManagement.adminFields.name'),
            validation: { required: 'اسم المشرف مطلوب' }
        },
        {
            name: 'phone',
            type: 'text',
            placeholder: t('accountsManagement.adminFields.phonePlaceHolder'),
            label: t('accountsManagement.adminFields.phone'),
            validation: {
                required: 'رقم الهاتف مطلوب',
                pattern: {
                    value: /^966\d{9}$/,
                    message: 'رقم الهاتف يجب أن يبدأ بـ 966 ويتبعه 9 أرقام'
                }
            }
        },
        {
            name: 'email',
            type: 'text',
            placeholder: t('accountsManagement.adminFields.emailPlaceHolder'),
            label: t('accountsManagement.adminFields.email'),
            validation: {
                required: 'البريد الإلكتروني مطلوب',
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'الرجاء إدخال بريد إلكتروني صحيح'
                }
            },
            full_width: true
        },
        {
            name: 'role_id',
            type: 'single-select',
            placeholder: t('accountsManagement.adminFields.permissionPlaceHolder'),
            label: t('accountsManagement.adminFields.permission'),
            options: rolesOptions,
            validation: { required: 'دور الحساب مطلوب' },
        },
        {
            name: 'is_active',
            type: 'single-select',
            placeholder: t('accountsManagement.adminFields.accountStatusPlaceHolder'),
            label: t('accountsManagement.adminFields.accountStatus'),
            options: [
                { label: 'نشط', value: 1 },
                { label: 'غير نشط', value: 0 }
            ],
            validation: { required: 'حالة الحساب مطلوبة' },
        },
    ], [t, rolesOptions]);

    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        name: admin?.name || '',
        phone: admin?.phone || '',
        email: admin?.email || '',
        role_id: adminSelectedRole?.value || '',
        is_active: admin?.is_active ?? 1,
    }), [admin, adminSelectedRole]);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            const payload = { id: admin?.id, ...data }
            await adminsService.updateAdmin(payload);
            toast.success(`${t('global.successUpdateProcessingRequest')}`);
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
                <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
                <BreedCrump breed_title={t('layouts.sideBar.accounts.admins')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('accountsManagement.editAdmin')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('global.save')}
                    showCancelBtn={true}
                    onSubmit={onSubmit}
                    onCancel={() => navigate(-1)}
                    enableReinitialize={!!admin} // فقط بعد تحميل admin
                />
            </div>
        </div>
    );
};

export default EditAdmin;

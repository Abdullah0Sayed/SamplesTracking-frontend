import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from '../../../forms/Form';
import { authService } from '../../../../services/auth/authService';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../toolkit/slicers/AuthSlicer';

const ChangePassword = () => {

    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const FIELDS = [
        {
            name: 'old_password',
            label: t('settings.editMyProfile.current_password'),
            type: 'password',
            placeholder: t('settings.editMyProfile.current_password_placeholder'),
            validation: {
                required: 'كلمة المرور الحالية مطلوبة',
                minLength: {
                    value: 6,
                    message: 'كلمة المرور يجب ألا تقل عن 6 أحرف'
                }
            },
        },

        {
            name: 'new_password',
            label: t('settings.editMyProfile.new_password'),
            type: 'password',
            placeholder: t('settings.editMyProfile.new_password_placeholder'),
            validation: {
                required: 'كلمة المرور الجديدة مطلوبة',
                minLength: {
                    value: 6,
                    message: 'كلمة المرور يجب ألا تقل عن 6 أحرف'
                }
            },
        }
        ,

        {
            name: 'confirmation_password',
            label: t('settings.editMyProfile.confirmation_password'),
            type: 'password',
            placeholder: t('settings.editMyProfile.confirmation_password_placeholder'),
            validation: {
                required: 'تأكيد كلمة المرور مطلوب',
                minLength: {
                    value: 6,
                    message: 'كلمة المرور يجب ألا تقل عن 6 أحرف'
                }
            },
        }
    ]

    const INITIAL_VALUES = {
        old_password: '',
        new_password: '',
        confirmation_password: ''
    }
    const onSubmit = async (data) => {

        try {
            if (data.new_password !== data.confirmation_password) {
                toast.warning(`${t('global.dismatchPassword')}`);
                return;
            }
            const payload = {
                old_password: data.old_password,
                new_password: data.new_password
            }

            const res = await authService.changePassword(payload);
            toast.success(`${t('settings.editMyProfile.successUpdatePassword')}`)
            dispatch(logout());

        } catch (error) {
            console.log(error);
            toast.error(`${t('settings.editMyProfile.failedUpdatePassword')}`)
        }
    }

    return (
        <Form fields={FIELDS} initial_values={INITIAL_VALUES} submit_label={t('auth.forgetPassword.send')} onSubmit={onSubmit} showCancelBtn={false} />
    )
}

export default ChangePassword
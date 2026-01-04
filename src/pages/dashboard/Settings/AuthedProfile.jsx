import React from 'react'
import ProfileLayout from '../../../components/ui/profile/ProfileLayout'
import { useTranslation } from 'react-i18next'
import MainData from '../../../components/ui/profile/Auth/MainData';
import ChangePassword from '../../../components/ui/profile/Auth/ChangePassword';

const AuthedProfile = () => {

    const { t } = useTranslation('global');

    const navLinks = [
        {
            title: t('settings.editMyProfile.accountData'),
            element: <MainData />

        },
        // {
        //     title: t('settings.editMyProfile.password'),
        //     element: <ChangePassword />

        // },


    ]

    return (
        <ProfileLayout pageTitle={t('settings.editMyProfile.title')} navLinks={navLinks} />
    )
}

export default AuthedProfile
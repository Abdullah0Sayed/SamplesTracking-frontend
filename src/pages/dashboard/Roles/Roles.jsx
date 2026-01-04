import React, { useState } from 'react'
import BreedCrump from '../../../components/ui/BreedCrump';
import Modal from '../../../components/modals/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { BiPlus, BiSearch, BiUser } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import useRoles from '../../../hooks/roles/useRoles';
import Card from '../../../components/Services/Card';
import { useSelector } from 'react-redux';
import { rolesService } from '../../../services/roles/rolesService';
import { toast } from 'react-toastify';
import CheckUserPermission from '../../../middlewares/CheckUserPermission';

const Roles = () => {
    const { t } = useTranslation('global');
    const { roles, loading, error, search, setSearch, refetchRoles } = useRoles();
    const lang = useSelector(state => state.webLanguage)
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({ id: '', name: '' });


    const onDelete = async (roleId) => {
        try {
            const res = await rolesService.deleteRole(roleId);
            setIsDeleteModalOpen(false)
            toast.success(t("accountsManagement.roles.deleteRoleStatusSuccess"));
            refetchRoles()
        } catch (error) {
            console.log(error)
            setIsDeleteModalOpen(false)

            toast.success(t("global.errorProcessingRequest"));

        }
    }
    return (
        <>

            <div className={`w-full flex flex-col gap-8`}>
                <div className={`w-full flex flex-1 flex-wrap justify-between items-center`}>
                    <BreedCrump breed_title={t('accountsManagement.roles.title')} />
                    <div className={`w-full flex flex-row gap-2 items-center`}>
                        <div className={`relative w-72 h-12 flex flex-row items-center border border-gray-400 bg-white rounded-xl px-4 py-2`}>
                            <BiSearch className={`absolute z-40 right-2 text-2xl`} />
                            <input type="text" name={`search`} id={`search`} onChange={(e) => {
                                console.log(e.target.value);
                                setSearch(e.target.value)
                            }} placeholder={t('global.search')} className={`w-full absolute inset-0 rounded-xl border-none outline-none pr-10 pl-2 focus:ring-2 focus:ring-primary-color transition`} maxLength={150} />
                        </div>
                        <CheckUserPermission allowedPermission={"roles.create"}>
                            <Link className={`hover:scale-95 transition bg-primary-color rounded-xl text-white w-36 h-12 flex flex-row items-center justify-center gap-1`}
                                to={'add'}
                            >
                                <BiPlus />
                                {t('accountsManagement.roles.addRole')}
                            </Link>
                        </CheckUserPermission>

                    </div>
                </div>

                {/* Roles */}
                {
                    loading ? (<p>{t('global.loadingData')}</p>) :
                        error ? (<p>{t('global.errorInLoadingData')}</p>) :
                            roles.length === 0 ? (<p>{t('global.noDataFounded')}</p>) :
                                // <CheckUserPermission allowedPermission={"roles.view"}>

                                <div className={`w-full grid grid-cols-2 mobile:grid-cols-1 justify-between items-start gap-4`}>

                                    {
                                        roles.map((role, index) => (
                                            <Card
                                                key={index}
                                                cardTitle={role?.name}
                                                ServiceIcon={BiUser}
                                                serviceIconValue={role?.users_count}
                                                serviceIconTitle={t('global.admins')}
                                                editPermissionName={"roles.edit"}
                                                deletePermissionName={"roles.delete"}
                                                onEdit={() => navigate("add", {
                                                    state: { id: role.id }
                                                })}
                                                onDelete={() => {
                                                    setSelectedRow({ id: role.id, name: role.name })
                                                    setIsDeleteModalOpen(true)
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                    // </CheckUserPermission>


                }

            </div >

            {
                isDeleteModalOpen && <Modal onClose={() => setIsDeleteModalOpen(false)}>

                    <div className={`bg-white rounded-2xl flex flex-col justify-center items-center gap-4`}>
                        <p className={`text-base font-semibold`}>{t('global.areYouSureDelete')} {selectedRow.name}</p>
                        <div className={`w-full flex flex-row justify-center items-center gap-4`}>
                            <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => setIsDeleteModalOpen(false)}>{t('global.cancel')}</button>
                            <button className={`px-4 py-2 bg-red-600 text-white rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => onDelete(selectedRow.id)} >{t('global.save')}</button>
                        </div>
                    </div>
                </Modal>
            }


        </>
    )
}

export default Roles
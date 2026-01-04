import React, { useState } from 'react'

import BreedCrump from '../../../../components/ui/BreedCrump';
import DataTable from '../../../../components/dataTable/DataTable';
import { useTranslation } from 'react-i18next';
import Filters from "../../../../components/filters/Filter";
import { FaLockOpen } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import Modal from '../../../../components/modals/Modal';
import { toast } from 'react-toastify';
import { adminsService } from '../../../../services/accounts/adminsService';
import { handleBulk } from '../../../../utils/handleBulkActions';
import useAdminsBlocked from '../../../../hooks/accounts/useAdminsBlocked';


const AdminsBlocked = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const { blockedAdmins, filters, loading, error, refetchBlockedAdmins, pagination, setFilters, setPage } = useAdminsBlocked();


    const [isOpenRestoreModal, setIsOpenRestoreModal] = useState(false);

    /** Columns */
    const COLUMNS = [
        { header: "#", accessor: "id" },
        { header: t('accountsManagement.admins_table.name'), accessor: "name" },
        { header: t('accountsManagement.admins_table.phone'), accessor: "phone" },
        {
            header: t('accountsManagement.admins_table.permission'),
            accessor: (row) => lang === 'en' ? row.role.display_name_en : row.role.display_name_ar,
            width: "200px"
        },
    ];



    /** selected rows */
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({ id: '', name: '' });


    /** onRestore */
    const onRestore = async (selected) => {
        try {
            console.log(selected)
            const res = await adminsService.unBlockAdmin(selected.id);
            toast.success(t('accountsManagement.unBlockAdminSuccessStatus'))
            refetchBlockedAdmins();
            setIsOpenRestoreModal(false);

        } catch (error) {
            console.log(error)
            toast.error(t('global.errorProcessingRequest'));
            setIsOpenRestoreModal(false);

        }
    }


    /** handleBulk */
    const handleBulkAction = (ids, actionType) => {
        handleBulk({
            serviceObject: adminsService,
            serviceMethod: "bulkActions",
            actionType: actionType,
            params: [ids, actionType],
            onSuccess: (data) => { toast.success(data?.message); refetchBlockedAdmins() },
            onError: (error) => toast.error(error?.message)
        })
    }

    return (
        <>
            <div className={`w-full flex flex-col gap-4`}>
                <BreedCrump breed_title={t('layouts.sideBar.accounts.admins')} />

                <div className={`bg-white shadow-md rounded-2xl flex flex-col gap-2`}>
                    <div className={`w-full flex flex-row justify-between items-center flex-wrap p-4`}>
                        {
                            selectedRows.length === 0 ? (<Filters onFilterChange={setFilters} onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                                filtersFromModel={filters} isSearchEnabled={true} searchText={filters.search} isFiltersEnabled={false} />
                            ) : <div className={`flex flex-row gap-2 text-grey-5 items-center`}
                            >
                                <span>{t('global.selected')} {selectedRows.length}</span>
                                <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}

                                >
                                    <FaLockOpen title={`${lang === 'en' ? 'unBlock users' : 'إلغاء حظر المستخدمين'}`} onClick={() => handleBulkAction(selectedRows, 'unblock')} />
                                </button>
                            </div>
                        }


                    </div>
                    <DataTable columns={COLUMNS} data={blockedAdmins} loading={loading} selected_rows={selectedRows} onChangeSelected={setSelectedRows} onPageChange={setPage} pagination={pagination} renderRowActions={(row) => (
                        <div className={`flex flex-row gap-2 items-center`}>

                            <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                onClick={() => {
                                    console.log(row)
                                    setSelectedRow({ id: row.id, name: row.name })
                                    setIsOpenRestoreModal(true);

                                }}
                            >
                                <FaLockOpen title={`${lang === 'en' ? 'unBlock' : 'إلغاء حظر'}`} />
                            </button>
                        </div>
                    )} />
                </div>
            </div>

            {/* Modal */}
            {
                isOpenRestoreModal && <Modal onClose={() => setIsOpenRestoreModal(false)}>
                    <div className={`bg-white rounded-2xl flex flex-col justify-center items-center gap-4`}>
                        <p className={`text-base font-semibold`}>{t('global.areYouSureUnBlock')} {selectedRow.name} {lang === 'en' ? '?' : '؟'}</p>
                        <div className={`w-full flex flex-row justify-center items-center gap-4`}>
                            <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => setIsOpenDeleteModal(false)}>{t('global.cancel')}</button>
                            <button className={`px-4 py-2 bg-red-600 text-white rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => onRestore(selectedRow)} >{t('global.save')}</button>
                        </div>
                    </div>
                </Modal>
            }
        </>


    )
}

export default AdminsBlocked
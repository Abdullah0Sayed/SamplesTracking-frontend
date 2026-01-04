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
import { clientsService } from '../../../../services/accounts/clientsService';
import useCompaniesBlocked from '../../../../hooks/accounts/useCompaniesBlocked';
import { companiesService } from '../../../../services/accounts/companiesService';

const CompaniesBlocked = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const { blockedCompanies, filters, loading, error, refetchBlockedCompanies, pagination, setFilters, setPage } = useCompaniesBlocked();


    const [isOpenRestoreModal, setIsOpenRestoreModal] = useState(false);


    /** Columns */
    const COLUMNS = [
        { header: "#", accessor: "id" },
        { header: t('accounts_mangement.companies_table.name'), accessor: "name", width: "150px" },
        { header: t('accounts_mangement.companies_table.phone'), accessor: "phone" },
        {
            header: t('accounts_mangement.companies_table.city'),
            accessor: (row) => lang === 'en' ? row.city.name_en : row.city.name_ar
        },
        {
            header: t('accounts_mangement.companies_table.commercialRegistrationNumber'),
            accessor: "commercial_register_number"
        },
        {
            header: t('accounts_mangement.companies_table.file'),
            accessor: (row) => (row.commercial_file ? <Link target='_blank' className={`px-2 py-1 text-xs hover:bg-primary-color transition hover:text-white text-primary-color/80 rounded-md text-white`} download={true} to={row.commercial_file}>{t('global.download')}</Link> : '-')
            , width: "100px"
        },
        {
            header: t('accounts_mangement.companies_table.services'),
            accessor: (row) => row.services.map((service) => (<div key={service.id} className={`flex flex-row gap-1`}>{lang === 'en' ? service.name_en : service.name_ar}</div>))
            , width: "200px"
        },
        {
            header: t('accounts_mangement.companies_table.numberOfWorkers'),
            accessor: "workers_count"
            , width: "100px"
        },
        {
            header: t('accounts_mangement.companies_table.description'),
            accessor: "description"
            , width: "200px"
        },



    ];




    /** selected rows */
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({ id: '', name: '' });


    /** onRestore */
    const onRestore = async (selected) => {
        try {
            console.log(selected)
            const res = await companiesService.unBlockCompany(selected.id);
            toast.success(t('accounts_mangement.unBlockCompanySuccessStatus'))
            refetchBlockedCompanies();
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
            serviceObject: clientsService,
            serviceMethod: "bulkActions",
            actionType: actionType,
            params: [ids, actionType],
            onSuccess: (data) => { toast.success(data?.message); refetchBlockedCompanies() },
            onError: (error) => toast.error(error?.message)
        })
    }

    return (
        <>
            <div className={`w-full flex flex-col gap-4`}>
                <BreedCrump breed_title={t('layouts.sideBar.accounts.clients')} />

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
                    <DataTable columns={COLUMNS} data={blockedCompanies} loading={loading} selected_rows={selectedRows} onChangeSelected={setSelectedRows} onPageChange={setPage} pagination={pagination} renderRowActions={(row) => (
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
                            <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => setIsOpenRestoreModal(false)}>{t('global.cancel')}</button>
                            <button className={`px-4 py-2 bg-red-600 text-white rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => onRestore(selectedRow)} >{t('global.save')}</button>
                        </div>
                    </div>
                </Modal>
            }
        </>


    )
}

export default CompaniesBlocked
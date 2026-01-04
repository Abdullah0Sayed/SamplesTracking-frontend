import React, { useState } from 'react'

import BreedCrump from '../../../components/ui/BreedCrump';
import DataTable from '../../../components/dataTable/DataTable';
import formatArabicDate from '../../../utils/formatArabicDate'
import { useTranslation } from 'react-i18next';
import Filters from "../../../components/filters/Filter";
import { FaFileArrowDown } from 'react-icons/fa6';
import { BiBlock, BiPencil, BiPlus } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../../components/modals/Modal';
import { toast } from 'react-toastify';
import { BsEye } from 'react-icons/bs';
import { handleBulk } from '../../../utils/handleBulkActions';
import useSamples from '../../../hooks/samples/useSamples';
import { sampleService } from '../../../services/samples/sampleService';
import useBioBanking from '../../../hooks/bioBanking/useBioBanking';
import { bioBankingService } from '../../../services/bioBanking/bioBankingService';
import CheckUserPermission from '../../../middlewares/CheckUserPermission';
import hasAnyPermission from '../../../hooks/permissions/hasAnyPermission';

const BioBanking = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const { user } = useSelector(state => state.auth);
    const formattedDate = formatArabicDate;
    const { bioBankingResults, error, loading, filters, pagination, refetchBioBankingResults, setFilters, setPage } = useBioBanking();
    const navigate = useNavigate();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);



    /** Columns */
    const COLUMNS = [
        { header: "#", accessor: "id" },
        { header: t('bioBankingManagement.bioBanking_table.tube_number'), accessor: "tube_number" },
        { header: t('bioBankingManagement.bioBanking_table.laboratory'), accessor: (row) => row?.laboratory?.name },
        { header: t('bioBankingManagement.bioBanking_table.freezer_id'), accessor: (row) => row?.freezer_id?.name },
        { header: t('bioBankingManagement.bioBanking_table.refrigerator_id'), accessor: (row) => row?.refrigerator_id?.name },
        { header: t('bioBankingManagement.bioBanking_table.temperature'), accessor: "temperature" },
        { header: t('bioBankingManagement.bioBanking_table.notes'), accessor: "notes" },
        { header: t('bioBankingManagement.bioBanking_table.sample'), accessor: (row) => row.sample?.serial_full },
        {
            header: t('bioBankingManagement.bioBanking_table.date'),
            accessor: (row) =>
                lang === 'ar'
                    ? formattedDate(row.created_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : formattedDate(row.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
        },

    ];


    const FILTER_GROUPS = [
        {
            key: 'sorted_by',
            label: 'الترتيب حسب',
            type: 'radio',
            options: [
                { value: '', label: 'الكل' },
                { value: 'name', label: 'الأسم' },
                { value: 'newest', label: 'الأحدث أولاً' },
                { value: 'oldest', label: 'الأقدم أولاً' },
            ],
        },


    ]

    /** selected rows */
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({ id: '', name: '' });


    /** onDelete */
    const onDelete = async (selected) => {
        try {
            console.log(selected)
            const res = await bioBankingService.deleteBioBanking(selected.id);
            toast.success(t('bioBankingManagement.deleteBioBankingSuccessStatus'))
            refetchBioBankingResults();
            setIsOpenDeleteModal(false);

        } catch (error) {
            console.log(error)
            toast.error(t('global.errorProcessingRequest'));
            setIsOpenDeleteModal(false);

        }
    }


    /** handleBulk */
    const handleBulkAction = (ids, actionType) => {
        handleBulk({
            serviceObject: sampleService,
            serviceMethod: "bulkActions",
            actionType: actionType,
            params: [ids, actionType],
            onSuccess: (data) => { toast.success(data?.message); refetchBioBankingResults() },
            onError: (error) => toast.error(error?.message)
        })
    }

    return (
        <>
            <div className={`w-full flex flex-col gap-4`}>
                <BreedCrump breed_title={t('layouts.sideBar.bioBankingManagement')} />

                <div className={`bg-white shadow-md rounded-2xl flex flex-col gap-2`}>
                    <div className={`w-full flex flex-row justify-between items-center flex-wrap p-4`}>
                        {/* {
                            selectedRows.length === 0 ? (<Filters filterGroups={FILTER_GROUPS} onFilterChange={setFilters} onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                                filtersFromModel={filters} isSearchEnabled={true} searchText={filters.search} isFiltersEnabled={true} />
                            ) : <div className={`flex flex-row gap-2 text-grey-5 items-center`}>
                                <span>{t('global.selected')} {selectedRows.length}</span>
                                <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}

                                >
                                    <BsEye title={`${lang === 'en' ? 'active Toggle' : 'تبديل النشاط'}`}

                                        onClick={() => handleBulkAction(selectedRows, 'activationToggle')}
                                    />
                                </button>
                                <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}

                                >
                                    <BiBlock title={`${lang === 'en' ? 'block users' : 'حظر المستخدمين'}`} onClick={() => handleBulkAction(selectedRows, 'block')} />
                                </button>
                            </div>
                        } */}

                        <Filters filterGroups={FILTER_GROUPS} onFilterChange={setFilters} onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                            filtersFromModel={filters} isSearchEnabled={true} searchText={filters.search} isFiltersEnabled={true} />

                        <div className='flex gap-2'>
                            {/* <CheckUserPermission allowedPermission={"bioBanking.export"}>

                                <div className="flex gap-2">
                                    <button
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white transition text-green-500`}
                                        onClick={() => handleBulkAction(selectedRows, 'export')}>
                                        <FaFileArrowDown className="w-5 h-5" title={`${lang === 'en' ? 'Export BioBanking CSV Sheet' : 'تصدير شيت النتائج الحيوية'}`} /> {t('global.download')}
                                    </button>
                                </div>
                            </CheckUserPermission> */}


                            <CheckUserPermission allowedPermission={"bioBanking.create"}>

                                <Link
                                    to={'add'}
                                    className={`flex items-center gap-1 px-4 py-2 text-white rounded-lg bg-primary-color`}

                                >
                                    <BiPlus className="w-5 h-5" />
                                    {t('bioBankingManagement.addBioBanking')}
                                </Link>
                            </CheckUserPermission>


                        </div>


                    </div>
                    <DataTable columns={COLUMNS} data={bioBankingResults} loading={loading} selected_rows={selectedRows} onChangeSelected={setSelectedRows} onPageChange={setPage} pagination={pagination} renderRowActions={(row) => {
                        const canAnyPermission = hasAnyPermission(user?.permissions, ["bioBanking.edit", "bioBanking.delete"], user?.role?.name?.toLowerCase());
                        return canAnyPermission && (
                            <div className={`flex flex-row gap-2 items-center`}>
                                <CheckUserPermission allowedPermission={"bioBanking.edit"}>

                                    <Link to={`${row.id}/edit`} className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                        state={row}
                                    >
                                        <BiPencil title={`${lang === 'en' ? 'Edit' : 'تعديل'}`} />
                                    </Link>
                                </CheckUserPermission>
                                <CheckUserPermission allowedPermission={"bioBanking.delete"}>

                                    <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                        onClick={() => {
                                            console.log(row)
                                            setSelectedRow({ id: row.id, name: row.storage_location })
                                            setIsOpenDeleteModal(true);

                                        }}
                                    >
                                        <BiBlock title={`${lang === 'en' ? 'Delete' : 'حذف'}`} />
                                    </button>
                                </CheckUserPermission>

                            </div>
                        )
                    }} />
                </div>
            </div>

            {/* Modal */}
            {
                isOpenDeleteModal && <Modal onClose={() => setIsOpenDeleteModal(false)}>
                    <div className={`bg-white rounded-2xl flex flex-col justify-center items-center gap-4`}>
                        <p className={`text-base font-semibold`}>{t('global.areYouSureDelete')} {selectedRow.name} {lang === 'en' ? '?' : '؟'}</p>
                        <div className={`w-full flex flex-row justify-center items-center gap-4`}>
                            <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => setIsOpenDeleteModal(false)}>{t('global.cancel')}</button>
                            <button className={`px-4 py-2 bg-red-600 text-white rounded-md text-center hover:scale-95 transition-all`} type='button' onClick={() => onDelete(selectedRow)} >{t('global.save')}</button>
                        </div>
                    </div>
                </Modal>
            }
        </>


    )
}

export default BioBanking
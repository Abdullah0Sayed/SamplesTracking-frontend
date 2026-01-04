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
import CheckUserPermission from '../../../middlewares/CheckUserPermission';
import hasAnyPermission from '../../../hooks/permissions/hasAnyPermission';


const Samples = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const { user } = useSelector(state => state.auth);
    const formattedDate = formatArabicDate;
    const { samples, error, loading, filters, pagination, refetchSamples, setFilters, setPage } = useSamples();
    const navigate = useNavigate();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const spanColoring = (value) => {
        var color = 'bg-blue-200 text-blue-600';
        switch (value) {
            case 'received':
                color = 'bg-blue-200 text-blue-600'
                break;
            case 'in_progress':
                color = 'bg-yellow-200 text-yellow-600'
                break;
            case 'accepted':
            case 'completed':
            case 'سليمة':
            case 1:
                color = 'bg-green-200 text-green-600'
                break;
            case 'rejected':
            case 'canceled':
            case 'غير صالحة':
            case 0:
                color = 'bg-red-200 text-red-600'
                break;
            case 'pending':
                color = 'bg-gray-200 text-gray-600'
                break;


        }

        return color
    }

    /** Columns */
    const COLUMNS = [
        { header: "#", accessor: "id" },
        // { header: t('samplesManagement.samples_table.serial_name'), accessor: "serial_name" },
        // { header: t('samplesManagement.samples_table.serial_number'), accessor: "serial_number" },
        { header: t('samplesManagement.samples_table.serial_full'), accessor: "serial_full" },
        { header: t('samplesManagement.samples_table.sample_condition'), accessor: (row) => <span className={`px-2 py-1 rounded-full text-xs ${spanColoring(row.sample_condition)}`}>{row.sample_condition}</span> },
        { header: t('samplesManagement.samples_table.current_status'), accessor: (row) => <span className={`px-2 py-1 rounded-full text-xs ${spanColoring(row.current_status)}`}>{row.current_status}</span> },
        {
            header: t('samplesManagement.samples_table.is_completed'),
            accessor: (row) => {
                return row.is_completed === 1
                    ? <span className={`px-2 text-xs py-1 rounded-full ${spanColoring(row.is_completed)}`}>{t('global.yes')}</span>
                    : <span className={`px-2 text-xs py-1 rounded-full ${spanColoring(row.is_completed)}`}>{t('global.no')}</span>;
            }
        },
        { header: t('samplesManagement.samples_table.qc_status'), accessor: (row) => <span className={`px-2 py-1 rounded-full text-xs ${spanColoring(row.qc_status)}`}>{row.qc_status}</span> },

        {
            header: t('samplesManagement.samples_table.received_at'),
            accessor: (row) =>
                lang === 'ar'
                    ? formattedDate(row.received_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : formattedDate(row.received_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
        },
        {
            header: t('samplesManagement.samples_table.started_at'),
            accessor: (row) => row.started_at !== null ?
                lang === 'ar'
                    ? formattedDate(row.started_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : formattedDate(row.started_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }) : '-'
        },
        {
            header: t('samplesManagement.samples_table.completed_at'),
            accessor: (row) => row.completed_at !== null ?
                lang === 'ar'
                    ? formattedDate(row.completed_at).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : formattedDate(row.completed_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }) : '-'
        }
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
            const res = await sampleService.deleteSample(selected.id);
            toast.success(t('samplesManagement.deleteSampleSuccessStatus'))
            refetchSamples();
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
            onSuccess: (data) => { toast.success(data?.message); refetchSamples() },
            onError: (error) => toast.error(error?.message)
        })
    }

    return (
        <>
            <div className={`w-full flex flex-col gap-4`}>
                <BreedCrump breed_title={t('layouts.sideBar.samples')} />

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
                            {/* <CheckUserPermission allowedPermission={"samples.exports"}>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white transition text-green-500`}
                                        onClick={() => handleBulkAction(selectedRows, 'export')}>
                                        <FaFileArrowDown className="w-5 h-5" title={`${lang === 'en' ? 'Export Admins CSV Sheet' : 'تصدير شيت المسؤلين'}`} /> {t('global.download')}
                                    </button>
                                </div>
                            </CheckUserPermission> */}




                            <CheckUserPermission allowedPermission={"samples.create"}>

                                <Link
                                    to={'add'}
                                    className={`flex items-center gap-1 px-4 py-2 text-white rounded-lg bg-primary-color`}

                                >
                                    <BiPlus className="w-5 h-5" />
                                    {t('samplesManagement.addSample')}
                                </Link>
                            </CheckUserPermission>


                        </div>


                    </div>
                    <DataTable columns={COLUMNS} data={samples} loading={loading} selected_rows={selectedRows} onChangeSelected={setSelectedRows} onPageChange={setPage} pagination={pagination} renderRowActions={(row) => {
                        const canAnyPermission = hasAnyPermission(user?.permissions, ["samples.edit", "samples.delete"], user?.role?.name?.toLowerCase());
                        return canAnyPermission && (
                            <div className={`flex flex-row gap-2 items-center`}>
                                <CheckUserPermission allowedPermission={"samples.edit"}>

                                    <Link to={`${row.id}/edit`} className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                        state={row}
                                    >
                                        <BiPencil title={`${lang === 'en' ? 'Edit' : 'تعديل'}`} />
                                    </Link>
                                </CheckUserPermission>

                                <CheckUserPermission allowedPermission={"samples.show"}>

                                    <Link to={`${row.id}/show`} className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                        state={row}
                                    >
                                        <BsEye title={`${lang === 'en' ? 'Show' : 'عرض'}`} />
                                    </Link>
                                </CheckUserPermission>

                                <CheckUserPermission allowedPermission={"samples.delete"}>

                                    <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                                        onClick={() => {
                                            console.log(row)
                                            setSelectedRow({ id: row.id, name: row.serial_name })
                                            setIsOpenDeleteModal(true);

                                        }}
                                    >
                                        <BiBlock title={`${lang === 'en' ? 'Block' : 'حظر'}`} />
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

export default Samples
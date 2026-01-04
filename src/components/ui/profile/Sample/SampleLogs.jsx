import React, { useEffect, useState } from 'react'
import DataTable from '../../../dataTable/DataTable'
import { useTranslation } from 'react-i18next';
import formatArabicDate from '../../../../utils/formatArabicDate';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiBlock, BiPencil } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';

const SampleLogs = ({ sampleLogs = [] }) => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage)
    const formattedDate = formatArabicDate;
    const [loading, setLoading] = useState(true);
    /** selected rows */
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({ id: '', name: '' });



    /** Columns */
    const COLUMNS = [
        { header: "#", accessor: "id" },
        { header: t('samplesManagement.sample_logs_table.from_status'), accessor: "from_status" },
        { header: t('samplesManagement.sample_logs_table.to_status'), accessor: "to_status" },
        { header: t('samplesManagement.sample_logs_table.type'), accessor: "type" },
        { header: t('samplesManagement.sample_logs_table.note'), accessor: "note" },
        { header: t('samplesManagement.sample_logs_table.created_by'), accessor: (row) => row.created_by },

        {
            header: t('samplesManagement.sample_logs_table.created_at'),
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


    useEffect(() => {
        if (sampleLogs.length > 0) setLoading(false);
    }, [sampleLogs])
    return (
        <div className='w-full'>
            <DataTable columns={COLUMNS} data={sampleLogs} loading={loading} selected_rows={selectedRows} onChangeSelected={setSelectedRows} />
        </div>
    )
}

export default SampleLogs
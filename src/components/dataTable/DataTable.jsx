import React from 'react';
import { BiArrowFromLeft, BiArrowFromRight, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const DataTable = ({ enableCheckBox = true, columns, data, loading, pagination, onPageChange, selected_rows, onChangeSelected, renderRowActions = null }) => {
    const selected = selected_rows ?? [];
    const setSelected = onChangeSelected ?? (() => { });

    const allInPage = data.map((r) => r.id);

    const toggleAll = () => {
        setSelected((sel) =>
            sel.length === allInPage.length ? [] : allInPage
        );
    };

    const toggleOne = (id) => {
        setSelected((sel) =>
            sel.includes(id)
                ? sel.filter((value) => value !== id)
                : [...sel, id]
        );
    };

    return (
        <div className="relative w-full bg-white shadow-md p-2 mt-4 overflow-x-auto">
            <table className="w-full table-auto text-sm text-center">
                <thead className="w-full bg-slate-100 text-black">
                    <tr>
                        {
                            enableCheckBox && <th className="px-2 py-4 w-2">
                                <input
                                    type="checkbox"
                                    checked={data.length > 0 && selected.length === data.length}
                                    onChange={toggleAll}
                                />
                            </th>
                        }


                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="px-2 py-4"
                                style={{
                                    width: col.width ? col.width : 'fit-content',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {col.header}
                            </th>
                        ))}

                        {renderRowActions && <th className="px-2 py-4 w-40">الإجراءات</th>}
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? data.map((row) => (
                        <tr key={row.id} className="border-t hover:bg-slate-100 transition">
                            {
                                enableCheckBox && <td className="px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(row.id)}
                                        onChange={() => toggleOne(row.id)}
                                    />
                                </td>
                            }


                            {columns.map((col, idx) => {
                                const value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];

                                return (
                                    <td key={idx} className="px-2 py-4">
                                        {col.Cell ? col.Cell({ value, row }) : value}
                                    </td>
                                );
                            })}

                            {renderRowActions && (
                                <td className="px-2 py-4">
                                    {renderRowActions(row)}
                                </td>
                            )}
                        </tr>
                    )) :
                        <tr>
                            <td
                                colSpan={columns.length + (renderRowActions ? 2 : 1)}
                                className="text-center py-6"
                            >
                                {loading ? 'جاري تحميل البيانات ...' : 'لا يوجد بيانات'}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            {pagination && (
                <div className="w-full flex p-2 mt-4">
                    <div className="w-full flex items-center text-sm gap-2">
                        صفحة {pagination.current} من {pagination.total}
                    </div>

                    <div className="w-full flex justify-end items-center gap-4">
                        <button
                            disabled={pagination.current === 1}
                            onClick={() => onPageChange(pagination.current - 1)}
                            className="flex justify-center items-center gap-1 rounded-md border border-primary-color text-primary-color text-xs hover:bg-slate-100 hover:scale-95 transition-all px-2 py-1"
                        >
                            <BiChevronRight />

                        </button>

                        <span className="text-xs">
                            {pagination.current} / {pagination.total}
                        </span>

                        <button
                            disabled={pagination.current === pagination.total}
                            onClick={() => onPageChange(pagination.current + 1)}
                            className="flex justify-center items-center gap-1 rounded-md border border-primary-color text-primary-color text-xs hover:bg-slate-100 hover:scale-95 transition-all px-2 py-1"
                        >

                            <BiChevronLeft />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;

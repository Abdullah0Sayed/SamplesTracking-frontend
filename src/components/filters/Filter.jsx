import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { BiEqualizer } from 'react-icons/bi';
import { BsToggles2 } from 'react-icons/bs';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FiFilter } from 'react-icons/fi';
import { IoFilterCircle } from 'react-icons/io5'

const Filter = ({
    filterGroups,
    filtersFromModel,
    isSearchEnabled = true,
    isFiltersEnabled = true,
    onFilterChange,
    searchText,
    onSearchChange

}) => {
    const [open, setOpen] = useState(false);
    const handleReset = () => {
        const reset = {};
        filterGroups.forEach((g) => {
            reset[g.key] = undefined;
        })
        onFilterChange(reset)
    }

    const { t } = useTranslation('global');
    return (
        <div className={`relative inline-block`}>
            <div className={`flex items-center gap-3`}>
                {
                    isFiltersEnabled &&
                    (<button className={`bg-slate-100 rounded-md p-2`} onClick={() => setOpen((prev) => !prev)}>
                        <BsToggles2 className={`text-lg text-grey-5`} />
                    </button>)
                }

                {
                    isSearchEnabled && (
                        <div className={`relative`}>
                            <div className={`absolute inset-y-0 right-4 flex items-center`}>
                                <FaMagnifyingGlass className={`text-sm  `} />
                            </div>
                            <input type='text' value={searchText || ''} onChange={(e) => onSearchChange(e.target.value)} placeholder={t('global.search')} className={`pr-10 w-80 border rounded-md px-4 py-2 outline-none focus:border-primary-color text-grey-7 placeholder:text-grey-7 transition-all text-sm`} />
                        </div>
                    )
                }

            </div>

            {/* if open = filters menu */}
            {
                open && (
                    <div className={`absolute top-full right-0 mt-2 p-4 bg-white rounded-md shadow-md w-64 z-20 border`}>

                        {
                            filterGroups.map((group) => (
                                <div key={group.key} className={`mb-2 last:mb-0 border-b-2 border-b-grey-2`}>
                                    <p className={`w-fit text-sm font-bold mb-4 text-black rounded-md px-1 py-1 `}>{group.label}</p>

                                    {/* filters types */}
                                    {/* 1. radio filters */}
                                    {
                                        group.type === 'radio' && (
                                            <div className={`space-y-2`}>
                                                {
                                                    group.options.map((opt) => (
                                                        <label key={opt.value} className={`flex items-center gap-2`}>
                                                            <input type='radio' name={group.key} checked={filtersFromModel[group.key] === opt.value} onChange={() => onFilterChange({ ...filtersFromModel, [group.key]: filtersFromModel[group.key] === opt.value ? undefined : opt.value })} className={`form-radio w-3 h-3 text-third-color`} />
                                                            <span className={`text-xs`}>{opt.label}</span>
                                                        </label>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }

                        <div className={`flex items-center gap-4 mt-4`}>
                            <button onClick={handleReset}
                                className="w-full flex justify-center items-center gap-1 rounded-md text-grey-4 bg-grey-1 text-sm hover:scale-95 transition-all px-2 py-2"
                            >
                                إعادة تعيين
                            </button>
                            <button onClick={() => setOpen(false)}
                                className="w-full flex justify-center items-center gap-1 rounded-md bg-primary-color text-white text-sm hover:scale-95 transition-all px-2 py-2"
                            >
                                إغلاق القائمة
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Filter
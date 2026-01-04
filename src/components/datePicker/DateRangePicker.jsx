import { format } from 'date-fns';
import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { ar } from 'date-fns/locale/ar';

/** Style For Date Picker */
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowDown, FaCalendar } from 'react-icons/fa6';

const DateRangePicker = ({ onChange }) => {
    const [range, setRange] = useState([null, null]);
    const [startDate, endDate] = range;
    const [open, setOpen] = useState(false);
    const pickerRef = useRef(null);

    const toggleOpen = () => setOpen((prev) => !prev);
    const openDatePicker = () => setOpen(true)
    /** handle change in picker */
    const handleChange = (update) => {
        setRange(update);

        onChange?.(update);
        const [start, end] = update;

        if (start && end) {

            setOpen(false);
        }

    };

    /** format date */
    const formatDate = (date) => {
        return date ? format(date, 'yyyy/M/d', { locale: ar }) : '....'
    }
    return (
        <div className={`relative`} ref={pickerRef} onClick={() => console.log(pickerRef)}>
            <button className={`w-full hover:scale-95 transition-all p-2 flex rounded-md bg-primary-color text-white gap-8 text-sm justify-between items-center`} onClick={toggleOpen}>
                <div className={`flex items-center justify-center gap-2`}>
                    <FaArrowDown />
                    <span> {startDate && endDate
                        ? `من : ${formatDate(startDate)} - حتى : ${formatDate(endDate)}`
                        : 'اختر الفترة الزمنية'}</span>
                </div>
                <div>
                    <FaCalendar />
                </div>
            </button>

            {/** open date picker */}
            {open && <div className={`absolute  left-0 mt-2 z-50`}>
                <DatePicker
                    selected={startDate}
                    onChange={handleChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    locale={ar}
                    monthsShown={1}
                    calendarClassName="custom-datepicker"
                />
            </div>}
        </div>
    )
}

export default DateRangePicker
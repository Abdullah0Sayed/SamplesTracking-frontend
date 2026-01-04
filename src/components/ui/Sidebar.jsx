import React from 'react'
import sidebarItems from '../../utils/sidebarItems'
import SidebarItem from '../../utils/SidebarItem'
import { BiExit } from 'react-icons/bi'

const Sidebar = ({ isMobile = false, onClose }) => {
    return (
        <aside
            className={`
        bg-white shadow-md
        w-72 h-full
        flex flex-col gap-8 p-4
        ${isMobile
                    ? " largeScreen:flex XlargeScreen:flex XXlargeScreen:flex XXXlargeScreen:flex animate-slideIn"
                    : "mobile:hidden tablet:hidden smallScreen:hidden medScreen:hidden"
                }
    `}
        >

            {
                isMobile &&
                <div className={`w-full flex justify-start items-center text-2xl text-black/40`}>
                    <BiExit onClick={onClose} />
                </div>
            }
            <div className="flex justify-center">
                <img src="/logo.png" className="w-40" alt="logo" />
            </div>

            <ul className="flex flex-col gap-1">
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        item={item}
                        onClick={isMobile ? onClose : undefined} // إغلاق sidebar عند الضغط على أي رابط في الموبايل
                    />
                ))}
            </ul>
        </aside>
    )
}

export default Sidebar

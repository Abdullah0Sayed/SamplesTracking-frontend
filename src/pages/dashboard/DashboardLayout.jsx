import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Outlet, } from 'react-router-dom'
import Header from '../../components/ui/Header'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../components/ui/Sidebar'

const DashboardLayout = () => {

    const { loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { t } = useTranslation('global');


    return (
        <div className={`max-w-full flex w-full min-h-screen bg-gray-100 `}>
            {/* SideBar */}

            <div>
                <Sidebar />
            </div>


            <div className={`w-full flex flex-1 flex-col gap-2`}>
                <Header />
                {
                    loading ? 'جاري تحميل البيانات ...' : <main className={`mb-4 p-4`}>
                        <Outlet />
                    </main>
                }

            </div>

        </div>
    )
}

export default DashboardLayout
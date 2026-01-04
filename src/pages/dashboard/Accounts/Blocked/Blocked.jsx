import React, { useCallback, useEffect, useState } from 'react'

import BreedCrump from '../../../../components/ui/BreedCrump';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


import CardStatic from '../../../../components/home/CardStatic';

import { blockedService } from '../../../../services/accounts/blockedService';
import AdminsBlocked from './AdminsBlocked';
import ClientsBlocked from './ClientsBlocked';
import CompaniesBlocked from './CompaniesBlocked';

const Blocked = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();

    /** Stats */
    const [blockedStats, setBlockedStats] = useState({})
    /** Indexs */
    const [activeIndex, setActiveIndex] = useState(0);
    /** NavLinks */
    const navLinks = [
        {
            title: t('layouts.sideBar.accounts.admins'),
            element: <AdminsBlocked />

        },


    ]


    /** Fetch Stats */
    const fetchStats = useCallback(async () => {
        try {
            const { data } = await blockedService.getBlockStats();
            setBlockedStats(data.data)
        } catch (error) {
            console.log(error)
        }
    }, []);


    useEffect(() => {
        fetchStats();
    }, [])




    return (
        <>

            <div className={`w-full flex flex-col gap-4`}>
                <BreedCrump breed_title={t('layouts.sideBar.accounts.blocked')} />


                <div className={`flex flex-row w-full`}>
                    <CardStatic card_bg_color={`bg-white rounded-md shadow`} card_static_value={blockedStats?.blocked_companies?.count} dataForChart={[{ count: 20 }, { count: 30 }, { count: 60 }]} card_static_measurement={'43%'} card_static_title={blockedStats?.blocked_companies?.label} />
                    <CardStatic card_bg_color={`bg-white rounded-md shadow`} card_static_value={blockedStats?.blocked_clients?.count} dataForChart={[{ count: 20 }, { count: 30 }, { count: 60 }]} card_static_measurement={'43%'} card_static_title={blockedStats?.blocked_clients?.label} />
                    <CardStatic card_bg_color={`bg-white rounded-md shadow`} card_static_value={blockedStats?.total_blocked_users?.count} dataForChart={[{ count: 20 }, { count: 30 }, { count: 60 }]} card_static_measurement={'43%'} card_static_title={blockedStats?.total_blocked_users?.label} />
                </div>

                <div className={`flex flex-row gap-2 items-center`}>
                    {
                        navLinks.map((nLink, index) => (
                            <Link key={index} className={`rounded-xl py-2 px-4 text-lg font-medium ${activeIndex === index ? 'bg-primary-color text-white' : 'border border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition'} `}
                                onClick={() => setActiveIndex(index)}
                            >{nLink.title}</Link>
                        ))
                    }
                </div>

                <div className={`w-full flex flex-col gap-2 rounded-2xl py-4 px-4 bg-white shadow-md`}>
                    {
                        navLinks[activeIndex].element
                    }
                </div>


            </div>


        </>
    )
}

export default Blocked
import React, { useEffect, useMemo, useState } from 'react';
import { BiCheck, BiChevronDown, BiGlobe, BiMenuAltRight } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { setWebLang } from '../../toolkit/slicers/languageSlicer';
import { logout } from '../../toolkit/slicers/AuthSlicer';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import Modal from "../modals/Modal";
import Sidebar from './Sidebar';

const Header = () => {
    const { t } = useTranslation('global');
    const { user, loading } = useSelector(state => state.auth);
    const location = useLocation();
    const baseName = useMemo(() => location.pathname.split("/"), [location.pathname]);

    const [openLanguageMenu, setOpenLanguageMenu] = useState(false);
    const [openAccountControl, setOpenAccountControl] = useState(false);
    const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
    const [isOpenOverlayMenu, setIsOpenOverLayMenu] = useState(false);

    const lang = useSelector((state) => state.webLanguage);
    const dispatch = useDispatch();

    const swipeLang = (lang) => {
        dispatch(setWebLang(lang));
        setOpenLanguageMenu(false);
    };

    // اغلاق كل القوائم عند تغيير الصفحة
    useEffect(() => {
        setOpenLanguageMenu(false);
        setOpenAccountControl(false);
        setIsOpenOverLayMenu(false);
    }, [location.pathname]);

    // اغلاق القوائم عند الضغط خارجها
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenLanguageMenu(false);
            setOpenAccountControl(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (loading || !user) return null;

    const activeClass = `w-full text-center bg-primary-color/20 text-primary-color font-bold rounded-lg h-12 p-2`;
    const inActiveClass = `w-full text-center text-black hover:bg-primary-color hover:text-white hover:opacity-85 transition-all rounded-md p-2`;

    return (
        <>
            <header className={`w-full h-20 flex justify-between items-center p-2 shadow-md bg-white`}>
                {baseName.includes("auth") && (
                    <div className={`w-full fixclick-logo`}>
                        <img src={'/logo.png'} alt={`molTracking-logo`} className={`w-80 h-16 object-contain`} />
                    </div>
                )}

                {baseName.includes("dashboard") && (
                    <>
                        <div className={`w-full mobile:hidden tablet:hidden smallScreen:hidden medScreen:hidden flex flex-col gap-2`}>
                            <p className={`text-lg font-black`}>{t('global.hi')} {user?.name}</p>
                            <p className={`text-sm`}>{t('dashboard.headerHint')}</p>
                        </div>

                        {/* زرار Menu للهاتف */}
                        <div className="text-2xl cursor-pointer mobile:block tablet:block smallScreen:block medScreen:block hidden" onClick={(e) => {
                            e.stopPropagation(); // يمنع event من الانتقال للـ document
                            setIsOpenOverLayMenu(true); // افتح الـ sidebar
                        }}>
                            <BiMenuAltRight />
                        </div>

                    </>
                )}

                <div className={`w-full grid grid-cols-[auto,auto,auto] justify-end items-center gap-4`}>
                    {/* Language Menu */}
                    <div className={`w-full flex flex-row mobile:hidden`}>
                        <div className={`relative`} onClick={(e) => e.stopPropagation()}>
                            <button className={`flex flex-row gap-2 justify-center items-center`}
                                onClick={() => setOpenLanguageMenu(prev => !prev)}>
                                <BiGlobe className={`text-xl`} />
                                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                            </button>

                            {openLanguageMenu && (
                                <motion.div initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-5 w-56 bg-white border shadow-md px-2 py-4 rounded-xl flex flex-col gap-4 z-50`}>
                                    <label className={`flex gap-2 cursor-pointer px-2 py-2 rounded-lg hover:bg-second-color/50`}
                                        onClick={() => swipeLang('ar')}>
                                        <input type={`checkbox`} className={`peer hidden`} />
                                        <span className={`w-6 h-6 rounded-full border-2 ${lang === 'ar' ? 'bg-second-color border-second-color' : 'bg-white border-gray-400'} flex items-center justify-center`}></span>
                                        <BiCheck className={`absolute w-6 h-6 text-white block`} />
                                        <span>{t('global.arabic')}</span>
                                    </label>
                                    <label className={`flex gap-2 cursor-pointer px-2 py-2 rounded-lg hover:bg-second-color/50`}
                                        onClick={() => swipeLang('en')}>
                                        <input type={`checkbox`} className={`peer hidden`} />
                                        <span className={`w-6 h-6 rounded-full border-2 ${lang === 'en' ? 'bg-second-color border-second-color' : 'bg-white border-gray-400'} flex items-center justify-center`}></span>
                                        <BiCheck className={`absolute w-6 h-6 text-white block`} />
                                        <span>{t('global.english')}</span>
                                    </label>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* الحساب */}
                    {baseName.includes("dashboard") && (
                        <div className={`w-full relative flex flex-row gap-2`} onClick={(e) => e.stopPropagation()}>
                            {/* <div className={`w-full flex flex-row gap-2 items-center`}>
                                <div className={`w-12 h-12 rounded-2xl bg-slate-500 overflow-hidden ring-1 ring-primary-color hover:ring-2 transition`}>
                                    <img src={`/avatar.png`} alt={user?.name} className={`object-cover`} />
                                </div>
                                <div className={`flex flex-col gap-1`}>
                                    <p className={`text-sm font-bold`}>{user?.name}</p>
                                    <p className={`text-sm`}>{user?.role?.name}</p>
                                </div>
                            </div> */}
                            <div className="flex justify-center items-center cursor-pointer" onClick={() => setOpenAccountControl(prev => !prev)}>
                                <BiChevronDown className={`text-2xl`} />
                            </div>

                            {openAccountControl && (
                                <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-14 w-56 bg-white border shadow-md px-2 py-4 rounded-xl flex flex-col gap-2 z-50`}>
                                    {/* <div className={`flex flex-row gap-2 items-center`}>
                                        <div className={`w-12 h-12 rounded-2xl bg-slate-500 overflow-hidden ring-1 ring-primary-color hover:ring-2 transition`}>
                                            <img src={`/avatar.png`} alt={user?.name} className={`object-cover`} />
                                        </div>
                                        <div className={`flex flex-col gap-1`}>
                                            <p className={`text-sm font-bold`}>{user?.name}</p>
                                            <p className={`text-sm`}>{lang === 'ar' ? user?.role?.display_name_ar : user?.role?.display_name_en}</p>
                                        </div>
                                    </div> */}
                                    {/* <hr /> */}
                                    <div className={`w-full flex flex-col gap-2`}>

                                        <NavLink to={'me'} className={({ isActive }) => `${isActive ? activeClass : inActiveClass}`}>
                                            {t('layouts.header.myProfile')}
                                        </NavLink>


                                        <button className={`${inActiveClass}`} onClick={() => setIsOpenLogoutModal(true)}>
                                            {t('layouts.header.logout')}
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Modal تسجيل الخروج */}
            {isOpenLogoutModal && (
                <Modal>
                    <div className={`flex flex-col justify-center items-center gap-4`}>
                        <p className={`text-base font-semibold`}>{t('global.confirmLogout')}</p>
                        <div className={`w-full flex flex-row justify-center items-center gap-4`}>
                            <button className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md hover:scale-95 transition-all`} onClick={() => setIsOpenLogoutModal(false)}>
                                {t('global.cancel')}
                            </button>
                            <button className={`px-4 py-2 bg-primary-color text-white rounded-md hover:scale-95 transition-all`} onClick={() => dispatch(logout())}>
                                {t('global.confirm')}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Sidebar Overlay */}
            {isOpenOverlayMenu && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex"
                    onClick={() => setIsOpenOverLayMenu(false)} // الضغط على الخلفية يغلق
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        {/* منع أي click من الداخل لغلق overlay */}
                        <Sidebar
                            isMobile
                            onClose={() => setIsOpenOverLayMenu(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;


import { RouterProvider } from 'react-router-dom';
import './App.css';
import { app_router } from './router/Router';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadTokenFromLocalStorage } from './toolkit/slicers/AuthSlicer';
import i18n from "./i18n";
import Cookies from 'js-cookie';
import { loadAuthedUserThunk } from './toolkit/slicers/Api/loadAuhedUserThunk';
import Loading from './components/ui/Loading';



function App() {
  const { user, loading, token, appReady } = useSelector(state => state.auth);

  const lang = useSelector((state) => state.webLanguage);

  /** For DOM Direction  */
  useEffect(() => {

    window.document.dir = i18n.dir();

    const handleChangeLanguage = (lang) => {
      window.document.dir = i18n.dir(lang);
    }

    i18n.on('languageChanged', handleChangeLanguage);

    return () => i18n.off('languageChanged', handleChangeLanguage)
  }, []);


  /** For SET LANGUAGE WHEN DOM LOADED */
  useEffect(() => {
    const langFromCookies = Cookies.get('lang');

    if (langFromCookies) {
      i18n.changeLanguage(langFromCookies);
    }
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTokenFromLocalStorage());
  }, [dispatch]);


  useEffect(() => {
    if (token) {
      dispatch(loadAuthedUserThunk());
    }
  }, [dispatch, token]);

  if (!appReady || loading) {
    return <Loading />
  }

  return (
    <>
      <div className={`${lang === 'en' ? 'font-montserrat' : 'font-cairo'}`}>
        <RouterProvider router={app_router} />

      </div>
      <ToastContainer position='top-right' />
    </>

  );
}

export default App;

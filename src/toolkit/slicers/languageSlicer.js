/** Create Slice */

import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../i18n";
import Cookies from "js-cookie";

const languageSlicer = createSlice({
    name: 'languageSlicer',
    initialState: i18n.language || 'ar',
    reducers: {
        setWebLang: (state, action) => {
            const lang = action.payload;

            i18n.changeLanguage(lang);
            Cookies.set('lang', lang);
            return lang;
        },
        getWebLang: (state) => {
            return state;
        }
    }
});


/** Export Reducers */
export const { setWebLang, getWebLang } = languageSlicer.actions;

export default languageSlicer.reducer;
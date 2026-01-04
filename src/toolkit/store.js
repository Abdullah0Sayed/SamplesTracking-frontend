/** Create Store */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slicers/AuthSlicer";
import languageReducer from "./slicers/languageSlicer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        webLanguage: languageReducer
    }
})
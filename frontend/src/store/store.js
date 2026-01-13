import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './authApi';
import { areaApi } from './areaApi';

export const store = configureStore({
    reducer: {
        [areaApi.reducerPath]: areaApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            areaApi.middleware,
            authApi.middleware
        ),
});

setupListeners(store.dispatch);
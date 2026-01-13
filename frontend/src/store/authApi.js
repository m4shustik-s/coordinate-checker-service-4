import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {areaApi} from "./areaApi";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/area-checker/api',
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => 'auth/me',
            providesTags: ['User'],
        }),
        login: builder.mutation({
            query: ({ login, password }) => ({
                url: 'auth/login',
                method: 'POST',
                body: { login, password },
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation({
            query: ({ login, password, fullName, group, variant }) => ({
                url: 'auth/register',
                method: 'POST',
                body: { login, password, fullName, group, variant },
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(authApi.util.resetApiState());
                    dispatch(areaApi.util.resetApiState());
                }
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUserQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} = authApi;

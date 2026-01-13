import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const areaApi = createApi({
    reducerPath: 'areaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/area-checker/api',
    }),
    tagTypes: ['Point'],
    endpoints: (builder) => ({
        getPoints: builder.query({
            query: () => '/points',
            providesTags: ['Point'],
        }),

        checkPoint: builder.mutation({
            query: ({ x, y, r }) => ({
                url: '/points/check',
                method: 'POST',
                body: { x, y, r },
            }),
            invalidatesTags: ['Point'],
        }),

        clearPoints: builder.mutation({
            query: () => ({
                url: '/points',
                method: 'DELETE',
            }),
            invalidatesTags: ['Point'],
        }),

    }),
});

export const {
    useGetPointsQuery,
    useCheckPointMutation,
    useClearPointsMutation,
} = areaApi;
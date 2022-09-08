import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const salesApi = createApi({
    reducerPath: 'sales',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SALES_API,
    }),
    endpoints: builder => ({
        getWineDetails: builder.query({
            query: ({winery_id, winevo_id}) => `/api/wineries/${winery_id}/wines/${winevo_id}/`
        }),
    }),
});
export const { useGetWineDetailsQuery } = salesApi;
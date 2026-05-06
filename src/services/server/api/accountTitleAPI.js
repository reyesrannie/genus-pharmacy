import { serverAPI } from "../request/serverAPI";
import { setAccountTitleData } from "../slice/valuesSlice";

export const accountTitleAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountTitle: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account_title`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountTitle"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (Array.isArray(data)) dispatch(setAccountTitleData(data));
          else dispatch(setAccountTitleData(data?.result));
        } catch (error) {}
      },
    }),
    createAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    updateAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    archiveAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    importAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/import/account_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
  }),
});

export const {
  useAccountTitleQuery,
  useLazyAccountTitleQuery,
  useCreateAccountTitleMutation,
  useUpdateAccountTitleMutation,
  useArchiveAccountTitleMutation,
  useImportAccountTitleMutation,
} = accountTitleAPI;

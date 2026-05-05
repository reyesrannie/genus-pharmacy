import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_API_KEY;

export const serverAPI = createApi({
  reducerPath: "serverAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "OneCharging",
    "AccountTitle",
    "Category",
    "Materials",
    "Uom",
    "ApprovalSetup",
    "Approver",
    "Order",
  ],
  endpoints: (builder) => ({}),
});

export const {} = serverAPI;

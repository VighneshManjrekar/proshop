import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...data },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: ORDERS_URL + `/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliveredOrder: builder.mutation({
      query: (orderId) => ({
        url: ORDERS_URL + `/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetAllOrdersQuery,
  useDeliveredOrderMutation,
} = orderApiSlice;

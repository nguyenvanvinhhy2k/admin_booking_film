import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const bookingAPI = {
	getBookings(params?: any): Promise<CommonResponse> {
		const url = "/v1/bookings"
		return getAsync(url, params);
	},
	addBookings( params: any): Promise<CommonResponse> {
		const url = "/v1/bookings"
		return postAsync(url, params);
	},
	updateBookings(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/v1/bookings/${id}`
    return patchAsync(url, params)
  },
	deleteBookings(
    id: string
  ): Promise<CommonResponse> {
    const url = `/v1/bookings/delete/${id}`
    return deleteAsync(url)
  }
};

export default bookingAPI;

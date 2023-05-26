import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const bookingAPI = {
	getBookings(params?: any): Promise<CommonResponse> {
		const url = "/bookings"
		return getAsync(url, params);
	},
	getMoviesBooinges(params?: any): Promise<CommonResponse> {
		const url = "/bookings/MoviesBooingest"
		return getAsync(url, params);
	},
	addBookings( params: any): Promise<CommonResponse> {
		const url = "/bookings"
		return postAsync(url, params);
	},
	updateBookings(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/bookings/${id}`
    return patchAsync(url, params)
  },
	deleteBookings(
    id: string
  ): Promise<CommonResponse> {
    const url = `/bookings/${id}`
    return deleteAsync(url)
  }
};

export default bookingAPI;

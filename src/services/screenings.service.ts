import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync, putAsync } from "./request";

const screeningsAPI = {
	getScreenings(params?: any): Promise<CommonResponse> {
		const url = "/v1/screenings"
		return getAsync(url, params);
	},
	addScreenings( params: any): Promise<CommonResponse> {
		const url = "/v1/screenings"
		return postAsync(url, params);
	},
	updateScreenings(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/v1/screenings/${id}`
    return putAsync(url, params)
  },
	deleteScreenings(
    id: string
  ): Promise<CommonResponse> {
    const url = `/v1/screenings/delete/${id}`
    return deleteAsync(url)
  }
};

export default screeningsAPI;

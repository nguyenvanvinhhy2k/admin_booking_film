import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const tourAPI = {
	getTour(params?: any): Promise<CommonResponse> {
		const url = "/tours"
		return getAsync(url, params);
	},
	addTour( params: any): Promise<CommonResponse> {
		const url = "/tours"
		return postAsync(url, params);
	},
	updateTour(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/tours/${id}`
    return patchAsync(url, params)
  },
	deleteTour(
    id: string
  ): Promise<CommonResponse> {
    const url = `/tours/${id}`
    return deleteAsync(url)
  }
};

export default tourAPI;

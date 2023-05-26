import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const reviewAPI = {
	getReviews(params?: any): Promise<CommonResponse> {
		const url = "/reviews"
		return getAsync(url, params);
	},
	addReviews( params: any): Promise<CommonResponse> {
		const url = "/reviews"
		return postAsync(url, params);
	},
	updateReviews(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/reviews/${id}`
    return patchAsync(url, params)
  },
	deleteReviews(
    id: string
  ): Promise<CommonResponse> {
    const url = `/reviews/${id}`
    return deleteAsync(url)
  }
};

export default reviewAPI;

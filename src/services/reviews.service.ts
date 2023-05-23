import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const reviewAPI = {
	getReviews(params?: any): Promise<CommonResponse> {
		const url = "/v1/reviews"
		return getAsync(url, params);
	},
	addReviews( params: any): Promise<CommonResponse> {
		const url = "/v1/reviews"
		return postAsync(url, params);
	},
	updateReviews(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/v1/reviews/${id}`
    return patchAsync(url, params)
  },
	deleteReviews(
    id: string
  ): Promise<CommonResponse> {
    const url = `/v1/reviews/delete/${id}`
    return deleteAsync(url)
  }
};

export default reviewAPI;

import { CommonResponse } from "models/common";
import { getAsync, patchAsync, deleteAsync, postAsync } from "./request";

const categoriesAPI = {
	getCategories(params?: any): Promise<CommonResponse> {
		const url = "/categories"
		return getAsync(url, params);
	},
	addCategories( params: any): Promise<CommonResponse> {
		const url = "/categories"
		return postAsync(url, params);
	},
	updateCategories(
    id: string,
    params: any
  ): Promise<CommonResponse> {
    const url = `/categories/${id}`
    return patchAsync(url, params)
  },
	deleteCategories(
    id: string
  ): Promise<CommonResponse> {
    const url = `/categories/${id}`
    return deleteAsync(url)
  }
};

export default categoriesAPI;

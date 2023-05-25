import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import categoriesAPI from "@/services/categories.service";
import ReactSelect from 'react-select';
import useQueryParams from "@/hooks/useQueryParams";

type IProps = {
	itemTours: Object | any
	showModalEdit: boolean
	setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const schema = yup.object().shape({
	tourName: yup.string().required("Vui lòng nhập tourName"),
	category: yup.string().required("Vui lòng nhập loại tour"),
	description: yup.string().required("Vui lòng nhập description"),
	capacity: yup.string().required("Vui lòng nhập capacity"),
	startDate: yup.string().required("Vui lòng nhập startDate"),
	endDate: yup.string().required("Vui lòng nhập endDate"),
	price: yup.string().required("Vui lòng nhập price"),
})

const ModalEditTour = ({ showModalEdit, setShowModalEdit, itemTours, callBack }: IProps) => {
	const [categories, setCategories] = useState<any>([])
	const [params, setQueryParams] = useQueryParams()
	const { page, limit, category } = params

	const {
		register,
		handleSubmit,
		formState,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			tourName: itemTours.tourName,
			category: itemTours.cateId,
			description: itemTours.description,
			capacity: itemTours.capacity,
			startDate: itemTours.startDate,
			endDate: itemTours.endDaterName,
			price: itemTours.price,
		}
	})

	const { errors, isDirty }: any = formState;

	const updatePost = async (data: any) => {
		try {
			const res = await categoriesAPI.updateCategories(itemTours?.id, {
				tourName: data.tourName,
				category: data.category,
				description: data.description,
				capacity: data.capacity,
				startDate: data.startDate,
				endDate: data.endDate,
				price: data.price,
			})
			setShowModalEdit(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Lưu thông tin thành công.')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const getDataListCategories = async () => {
		try {
		  const data = await categoriesAPI.getCategories()
		  setCategories(data?.data?.data)
		} catch (error) {
		  console.log(error)
		}
	  }

	  useEffect(() => {
		getDataListCategories()
	},[])

	useEffect(() => {
		reset({
			tourName: itemTours.tourName,
			category: itemTours.cateId,
			description: itemTours.description,
			capacity: itemTours.capacity,
			startDate: itemTours.startDate,
			endDate: itemTours.endDate,
			price: itemTours.price,
		})
	}, [itemTours, setShowModalEdit, showModalEdit])
	return (
		<>
			<Modal
				title="Sửa thông tin tour"
				open={showModalEdit}
				handleCancel={() => setShowModalEdit(false)}
				handleConfirm={handleSubmit(updatePost)}
				className="w-full max-w-[475px]"
				confirmButtonTitle="Lưu"
			>
				<div className="flex flex-col">
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Tên tour:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập tên tour"
									type="text"
									{...register("tourName")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.name && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.name?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
							  Mô tả:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập mô tả"
									type="text"
									{...register("description")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.description && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.description?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Loại tour:
							</span>
							<div className="flex-1">
							<select {...register("category")} id="crud-form-1" className="form-control w-full" >
									<option value={itemTours?.cateId} className="hidden" selected >{itemTours?.cateId}</option>
									{
										categories?.map((cate: any) => (
												<option key={cate?.id} value={cate?.id}>{cate?.name}</option>
										))
									}
								</select>
								</div>
						</div>
						{errors?.category && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.category?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Số tour:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập số tour"
									type="text"
									{...register("capacity")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.capacity && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.capacity?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Ngày bắt đầu:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập ngày bắt đầu"
									type="text"
									{...register("startDate")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.startDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.startDate?.message}
							</p>
						)}
					</div>

					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Ngày kết thúc:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập ngày kết thúcr"
									type="text"
									{...register("endDate")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.endDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.endDate?.message}
							</p>
						)}
					</div>

					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Giá price:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập giá tiền"
									type="text"
									{...register("price")}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.price && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.price?.message}
							</p>
						)}
					</div>
				</div>
			</Modal>
		</>
	)
}

export default ModalEditTour

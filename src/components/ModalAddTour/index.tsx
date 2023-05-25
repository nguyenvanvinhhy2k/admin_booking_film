import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import categoriesAPI from "@/services/categories.service";
import tourAPI from "@/services/tours.service";
import ReactSelect from 'react-select';
import useQueryParams from "@/hooks/useQueryParams";

const schema = yup.object().shape({
	tourName: yup.string().required("Vui lòng nhập tourName"),
	description: yup.string().required("Vui lòng nhập description"),
	capacity: yup.string().required("Vui lòng nhập capacity"),
	startDate: yup.string().required("Vui lòng nhập startDate"),
	endDate: yup.string().required("Vui lòng nhập endDate"),
	price: yup.string().required("Vui lòng nhập price"),
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddTour = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
    const [categories, setCategories] = useState<any>([])
	const [params, setQueryParams] = useQueryParams()
	const { page, limit, category } = params
	const {
		register,
		handleSubmit,
		formState,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			tourName: '',
			description: '',
			capacity: '',
			startDate: '',
			endDate: '',
			price: '',
		}
	})

	const { errors, isDirty }: any = formState;

	const addTour = async (data: any) => {
		try {
			const res = await tourAPI.addTour({
				tourName: data.tourName,
				description: data.description,
				capacity: data.capacity,
				startDate: data.startDate,
				endDate: data.endDate,
				price: data.price,
				cateId: 1
			})
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Thêm loại tour thành công.')
				setShowModalAdd(false)
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
			tourName: '',
			description: '',
			capacity: '',
			startDate: '',
			endDate: '',
			price: '',
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin tour"
			open={showModalAdd}
			handleCancel={() => setShowModalAdd(false)}
			handleConfirm={handleSubmit(addTour)}
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
								placeholder="Nhập tên"
								type="text"
								{...register("tourName")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.tourName && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.tourName?.message}
						</p>
					)}
				</div>

				<div className="my-2">
						<div className="flex items-center ">
							<label className="w-[140px] font-medium text-base">Loại tour: </label>
							<ReactSelect
								options={categories?.map((cate: any) => {
									return {
										value: cate.id,
										label: cate.name
									};
								}
								)}
								onChange={(value: any) => {
									setQueryParams({
										...params, page: page, limit: limit, category: value ? value.value : undefined
									}, true)
								}}
								className="w-48 flex-1"
								classNamePrefix="select-input__custom "
								isClearable
								value={
									categories?.filter((item:any) => item.id == category).map((item: any) => {
										return {
											value: item._id,
											label: item.name
										}
									})
								}
								placeholder="Chọn loại tour"
							/>
						</div>
						{errors?.categories && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.categories?.message}
							</p>
						)}
					</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Description:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập description"
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
						Capacity:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập Capacity"
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
						 Giá tiền:
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

				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Thời gian bắt đầu:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập thời gian bắt đầu"
								type="date"
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
						  Thời gian kết thúc:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập thời gian kết thúc"
								type="date"
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
			</div>
		</Modal>
	)
}

export default ModalAddTour

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import categoriesAPI from "@/services/categories.service";
import ReactSelect from 'react-select';
import useQueryParams from "@/hooks/useQueryParams";
import tourAPI from "@/services/tours.service";
import axios from "axios";
import { getCachedData } from "@/utils/storage";
import { ACCESS_TOKEN } from "@/contants/auth";

type IProps = {
	itemTours: Object | any
	showModalEdit: boolean
	setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const schema = yup.object().shape({
	tourName: yup.string().required("Vui lòng nhập tourName"),
	description: yup.string().required("Vui lòng nhập description"),
	capacity: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	startDate: yup.string().required("Vui lòng nhập startDate"),
	endDate: yup.string().required("Vui lòng nhập endDate"),
	category: yup.string().required("Vui lòng nhập cateId"),
	price: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	transport: yup.string().required("Vui lòng nhập transport"),
	startLocation: yup.string().required("Vui lòng nhập transport"),
	listLocation: yup.string().required("Vui lòng nhập listLocation"),
	listDate: yup.string().required("Vui lòng nhập listDate")
})

const ModalEditTour = ({ showModalEdit, setShowModalEdit, itemTours, callBack }: IProps) => {
	const [poster, setPoster] = useState<any>();
	const [banner, setBanner] = useState<any>();
	const [categories, setCategories] = useState<any>([])
	const [params, setQueryParams] = useQueryParams()
	const { page } = params


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
			endDate: itemTours.endDate,
			price: itemTours.price,
			transport: itemTours.transport,
			startLocation: itemTours.startLocation,
			listLocation: itemTours.listLocation,
			listDate: itemTours.listDate
		}
	})

	const { errors, isDirty }: any = formState;
	const accessToken = getCachedData(ACCESS_TOKEN)

	const updatePost = async (data: any) => {
		const formData = new FormData()
		formData.append("tourName", data.tourName)
		formData.append("description", data.description)
		formData.append("capacity", data.capacity)
		formData.append("banner", banner ? banner : itemTours.banner) //flie của banner
		formData.append("poster", poster ? poster : itemTours.poster) //file của poster
		formData.append("startDate", data.startDate)
		formData.append("endDate", data.endDate)
		formData.append("price", data.price)
		formData.append("cateId", data.category)
		formData.append("transport", data.transport)
		formData.append("startLocation", data.startLocation)
		formData.append("listLocation", data.listLocation)
		formData.append("listDate", data.listDate)
		formData.append("code", itemTours.code)
		try {
			const res = await axios({
				method: 'patch',
				url: `http://localhost:8228/tours/${itemTours.id}`,
				headers: {
					Authorization: 'Bearer ' + accessToken, //the token is a variable which holds the token
					"Content-Type": `multipart/form-data; boundary=${formData}`
				},
				data: formData
			})
			setShowModalEdit(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Lưu thông tin thành công.')
				setBanner(null)
				setPoster(null)
				setShowModalEdit(false)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const getDataListCategories = async () => {
		try {
		  const data = await categoriesAPI.getCategories({page: page, size: 999})
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
			transport: itemTours.transport,
			startLocation: itemTours.startLocation,
			listLocation: itemTours.listLocation,
			listDate: itemTours.listDate
		})
	}, [itemTours, setShowModalEdit, showModalEdit])
	return (
		<>
			<Modal
				title="Sửa thông tin tour"
				open={showModalEdit}
				handleCancel={() => {
					setShowModalEdit(false)
					setBanner(null),
					setPoster(null)}
				}
				handleConfirm={handleSubmit(updatePost)}
				className="w-full max-w-[70%]"
				confirmButtonTitle="Lưu"
			>
				<div className="flex flex-col">
				<div className="flex justify-between px-[20px]">
					<div className="">
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
							Chọn banner:
						</span>
						<div className=" w-[69%] flex items-center justify-between">
							<input type="file" accept=".png,.jpeg,.jpg" onChange={(e: any) => {if(e.target.files.length !== 0) setBanner(e?.target?.files[0])}} />
							{banner ? (<><img src={URL.createObjectURL(banner)} className="w-[80px] h-[80px]" alt="" />
								<div className="shareX ml-[10px] cursor-pointer" onClick={() => setBanner(null)}>X</div></>
							): (<img src={`http://localhost:8228/files/${itemTours?.banner}`} className="w-[80px] h-[80px]" alt="" />)}
						</div>
					</div>
				</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Chọn poster:
						</span>
						<div className=" w-[69%] flex items-center justify-between">
							<input type="file" accept=".png,.jpeg,.jpg" onChange={(e: any) => {if(e.target.files.length !== 0) setPoster(e?.target?.files[0])}} />
							{poster ? (<><img src={URL.createObjectURL(poster)} className="w-[80px] h-[80px]" alt="" />
								<div className="shareX ml-[10px] cursor-pointer" onClick={() => setPoster(null)}>X</div></>
							) : (<img src={`http://localhost:8228/files/${itemTours?.poster}`} className="w-[80px] h-[80px]" alt="" />)}
						</div>
					</div>
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
									<option value={itemTours?.cateId} className="hidden" selected >{itemTours?.cateName}</option>
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
					</div>
					<div className="">
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
								Ngày kết thúc:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập ngày kết thúcr"
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
					<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Phương tiện:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập phương tiện di chuyển"
								type="text"
								{...register("transport")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.transport && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.transport?.message}
						</p>
					)}
				</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						  Xuất phát:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập địa điểm xuất phát"
								type="text"
								{...register("startLocation")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.startLocation && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.startLocation?.message}
						</p>
					)}
				</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						  Các địa điểm:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập các địa điểm"
								type="text"
								{...register("listLocation")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.listLocation && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.listLocation?.message}
						</p>
					)}
							</div>

				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						  Các ngày đặt:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập các ngày đặt"
								type="text"
								{...register("listDate")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.listDate && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.listDate?.message}
						</p>
					)}
							</div>
				</div>
				</div>
				</div>
			</Modal>
		</>
	)
}

export default ModalEditTour

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
import axios from "axios";
import { getCachedData } from "@/utils/storage";
import { ACCESS_TOKEN } from "@/contants/auth";

const schema = yup.object().shape({
	tourName: yup.string().required("Vui lòng nhập tourName"),
	description: yup.string().required("Vui lòng nhập description"),
	capacity: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	startDate: yup.string().required("Vui lòng nhập startDate"),
	endDate: yup.string().required("Vui lòng nhập endDate"),
	cateId: yup.string().required("Vui lòng nhập cateId"),
	price: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	transport: yup.string().required("Vui lòng nhập transport"),
	startLocation: yup.string().required("Vui lòng nhập transport"),
	listLocation: yup.string().required("Vui lòng nhập transport")
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddTour = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
	const [poster, setPoster] = useState<any>(null);
	const [banner, setBanner] = useState<any>(null);
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
			cateId: '',
			description: '',
			capacity: '',
			startDate: '',
			endDate: '',
			price: '',
			transport: '',
			startLocation: '',
			listLocation: '',
		}
	})

	const { errors, isDirty }: any = formState;
	const accessToken = getCachedData(ACCESS_TOKEN)

	const addTour = async (data: any) => {
      const formData = new FormData()
      formData.append("tourName", data.tourName)
      formData.append("description", data.description)
      formData.append("capacity", data.capacity)
      formData.append("banner", banner) //flie của banner
      formData.append("poster", poster) //file của poster
      formData.append("startDate", data.startDate)
      formData.append("endDate", data.endDate)
      formData.append("price", data.price)
      formData.append("cateId", data.cateId)
			formData.append("transport", data.transport)
      formData.append("startLocation", data.startLocation)
      formData.append("listLocation", data.listLocation)
			formData.append("code", `T${Math.floor(1000 + Math.random() * 9000)}`)
		try {
			const res = await axios({
				method: 'post',
				url: 'http://localhost:8228/tours',
				headers: {
					Authorization: 'Bearer ' + accessToken, //the token is a variable which holds the token
					"Content-Type": `multipart/form-data; boundary=${formData}`
				},
				data: formData
			})
			//check lại res
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Thêm tour thành công.')
				setShowModalAdd(false)
				setBanner(null)
				setPoster(null)
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
			cateId: '',
			description: '',
			capacity: '',
			startDate: '',
			endDate: '',
			price: '',
			transport: '',
			startLocation: '',
			listLocation: '',
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin tour"
			open={showModalAdd}
			handleCancel={() => {setShowModalAdd(false)
				setBanner(null)
				setPoster(null)}}
			handleConfirm={handleSubmit(addTour)}
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
				<div className="my-2 h-[80px] flex items-center">
				<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Chọn banner:
						</span>
						<div className=" w-[69%] flex items-center justify-between">
							<input type="file" accept=".png,.jpeg,.jpg" onChange={(e: any) => setBanner(e?.target?.files[0])} />
							{banner && (<><img src={URL.createObjectURL(banner)} className="w-[80px] h-[80px]" alt="" />
								<div className="shareX ml-[10px] cursor-pointer" onClick={() => setBanner(null)}>X</div></>
							)}
						</div>
					</div>
				</div>
				<div className="my-2  h-[80px] flex items-center">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Chọn poster:
						</span>
						<div className=" w-[69%] flex items-center justify-between">
							<input type="file" accept=".png,.jpeg,.jpg" onChange={(e: any) => setPoster(e?.target?.files[0])} />
							{poster && (<><img src={URL.createObjectURL(poster)} className="w-[80px] h-[80px]" alt="" />
								<div className="shareX ml-[10px] cursor-pointer" onClick={() => setPoster(null)}>X</div></>
							)}
						</div>
					</div>
				</div>
				<div className="my-2">
					<div className="flex items-center ">
							<label className="w-[140px] font-medium text-base">Loại tour: </label>
							<div className="flex-1">
							<select {...register("cateId")} id="crud-form-1" className="form-control w-full">
							<option value="" className="hidden" selected >Nhập loại tour</option>
									{
										categories?.map((cate: any) => (
												<option key={cate?.id} value={cate?.id}>{cate?.name}</option>
										))
									}
								</select>
									</div>
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


				</div>
					<div className="">
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
						Ngày khời hành:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập ngày khời hành"
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
								placeholder="Nhập ngày kết thúc"
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
					</div>
				</div>


			</div>
		</Modal>
	)
}

export default ModalAddTour

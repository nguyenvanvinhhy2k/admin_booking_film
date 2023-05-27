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
	capacity: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	startDate: yup.string().required("Vui lòng nhập startDate"),
	endDate: yup.string().required("Vui lòng nhập endDate"),
	cateId: yup.string().required("Vui lòng nhập cateId"),
	price: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddTour = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
	const [poster, setPoster] = useState<any>(null);
	const [banner, setBanner] = useState<any>(null);
	const [files, setFiles] = useState<any>(null)
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
		}
	})

	console.log(files)

	const { errors, isDirty }: any = formState;

	const addTour = async (data: any) => {
		  // console.log(files)
      // const formData = new FormData()
			// console.log(formData)
      // formData.append("poster", files)
			// console.log(formData)
		try {
			const res = await tourAPI.addTour({
				tourName: data.tourName,
				description: data.description,
				capacity: data.capacity,
				poster: {
					poster: "poster"
				},
				banner: {
					banner: "banner"
				},
				startDate: data.startDate,
				endDate: data.endDate,
				price: data.price,
				cateId: data.cateId
			});
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
			cateId: '',
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
				{/* <input type="file" accept="image/*" onChange={handleFileInputPoster} />
				{poster.imagePreviewUrl && (<img src={poster.imagePreviewUrl} className="w-[80px] h-[80px]" alt="" />)} */}

        <input type="file" accept=".png,.jpeg,.jpg" onChange={(e: any)=> setFiles(e?.target?.files[0])} />
				{/* {banner.imagePreviewUrl && (<img src={banner.imagePreviewUrl} className="w-[80px] h-[80px]" alt="" />
				)} */}
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

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import { useAuth } from "@/contexts/auth";
import bookingAPI from "@/services/bookings.service";
import dayjs from "dayjs";

type IProps = {
	itemBookings: Object | any
	showModalEdit: boolean
	setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const schema = yup.object().shape({
	tourName: yup.string().required("Trường này bắt buộc nhập"),
	username: yup.string().required("Trường này bắt buộc nhập"),
	dateTime: yup.string().required("Trường này bắt buộc nhập"),
	bookingDate: yup.string().required("Trường này bắt buộc nhập"),
	status: yup.string().required("Trường này bắt buộc nhập"),
})


const actionsStatus = [
	{
		value: "DADAT",
		label: "Chờ xử lí"
	},
	{
		value: "DAXACNHAN",
		label: "Xác nhận"
	},
	{
		value: "DANGDITOUR",
		label: "Đang đi tour"
	},
	{
		value: "HUYTOUR",
		label: "Đã hủy"
	},
	{
		value: "DAHOANTHANHTOUR",
		label: "Đã hoàn thành"
	}
]

const ModalEditBookings = ({ showModalEdit, setShowModalEdit, itemBookings, callBack }: IProps) => {

	const formatDate = (date: Date, format: string) => {
		return dayjs(date).format(format);
	}

	const {
		register,
		handleSubmit,
		formState,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			tourName: itemBookings?.tours?.tourName,
			username: itemBookings?.user?.name,
			dateTime: formatDate(itemBookings?.createdAt, "DD/MM/YYYY HH:mm:ss"),
			bookingDate: `${itemBookings?.bookingDate}/2023`,
			status: itemBookings?.status,
		}
	})

	console.log(itemBookings)

	const { errors, isDirty }: any = formState;

	const updatePost = async (data: any) => {
		try {
			const res = await bookingAPI.updateBookings(itemBookings?.id, {
				userId: itemBookings?.userId,
				tourId: itemBookings?.tourId,
				bookingDate: itemBookings?.bookingDate,
				status: data?.status,
			})
			setShowModalEdit(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Cập nhật thông tin thành công.')
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		reset({
			tourName: itemBookings?.tours?.tourName,
			username: itemBookings?.user?.name,
			dateTime: formatDate(itemBookings?.createdAt, "DD/MM/YYYY HH:mm:ss"),
			bookingDate: `${itemBookings?.bookingDate}/2023`,
			status: itemBookings?.status,
		})
	}, [itemBookings, setShowModalEdit, showModalEdit])
	return (
		<>
			<Modal
				title="Sửa trạng thái bookings"
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
									type="text"
									{...register("tourName")}
									disabled={true}
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
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
							Tên người đặt:
							</span>
							<div className="flex-1">
								<input
									type="text"
									{...register("username")}
									className="form-control w-full"
									disabled={true}
								/>
							</div>
						</div>
						{errors?.username && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.username?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Thời gian đặt:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập Email"
									type="text"
									{...register("dateTime")}
									className="form-control w-full"
									disabled={true}
								/>
							</div>
						</div>
						{errors?.dateTime && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.dateTime?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Ngày khời hành:</span>
							<div className="flex-1">
								<input
									placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Trạng thái:</span>
							<div className="flex-1">
							<select {...register("status")} id="crud-form-1" className="form-control w-full" >
									<option value={itemBookings?.status} className="hidden" selected >{itemBookings?.status === "DADAT" ? "Chờ xử lí" : itemBookings.status === "DAXACNHAN" ? "Đã xác nhận" : itemBookings.status === "DANGDITOUR" ? "Đang đi tour" : itemBookings.status === "HUYTOUR" ? "Đã hủy" : itemBookings?.status === "DAHOANTHANHTOUR" && "Đã hoàn thành tour" }</option>
									{
										actionsStatus?.map((cate: any) => (
												<option key={cate?.value} value={cate?.value}>{cate?.label}</option>
										))
									}
								</select>
							</div>
						</div>
						{errors?.status && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.status?.message}
							</p>
						)}
					</div>

				</div>
			</Modal>
		</>
	)
}

export default ModalEditBookings

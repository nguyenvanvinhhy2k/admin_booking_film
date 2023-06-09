
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import bookingAPI from "@/services/bookings.service";
import dayjs from "dayjs";

type IProps = {
	itemBookings: Object | any
	showModalView: boolean
	setShowModalView: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalViewBookings = ({ showModalView, setShowModalView, itemBookings, callBack }: IProps) => {

	console.log(itemBookings)

	const formatDate = (date: Date, format: string) => {
		return dayjs(date).format(format);
	}

	return (
		<>
			<Modal
				title="Xem thông tin bookings"
				open={showModalView}
				handleCancel={() => setShowModalView(false)}
				className="w-full max-w-[700px]"
				confirmButtonTitle="Lưu"
				display
			>
				<div className="flex justify-between p-[20px] items-center">
					<div className="w-[50%] mr-[20px]">
						<img className="w-full h-full" src={`http://localhost:8228/files/${itemBookings?.movies?.poster}`} alt="" />
					</div>
					<div className="w-[50%]">
						<p className="mb-[10px]">Tên tour : {itemBookings?.movies?.title}</p>
						<p className="mb-[10px]">Tên rạp : {itemBookings?.movies?.cinemas?.name}</p>
						<p className="mb-[10px]">Tên phòng chiếu : {itemBookings?.movies?.screenings[0]?.name}</p>
						<p className="mb-[10px]">Người đặt : {itemBookings?.user?.name}</p>
						<p className="mb-[10px]">Số điện thoại : {itemBookings?.user?.phoneNumber}</p>
						<p className="mb-[10px]">Email : {itemBookings?.user?.email}</p>
						<p className="mb-[10px]">Tổng tiền : {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemBookings?.totalPrice)}</p>
						<p className="mb-[10px]">Ngày đặt : {itemBookings?.createdAt && formatDate(itemBookings?.createdAt, "DD/MM/YYYY HH:mm:ss")}</p>
						<p className="mb-[10px]">Trạng thái : <span className={`${itemBookings?.status === "DADAT" ? "text-[#FFCC00]" : itemBookings.status === "DAXACNHAN" ? "text-[#0066FF]" : itemBookings.status === "DANGXEMPHIM" ? "text-[#FF1493]" : itemBookings.status === "HUYTOUR" ? "text-[#CC0000]" : itemBookings?.status === "DAHOANTHANH" && "text-[#00CC00]"}`}>{itemBookings?.status === "DADAT" ? "Chờ xử lí" : itemBookings.status === "DAXACNHAN" ? "Đã xác nhận" : itemBookings.status === "DANGXEMPHIM" ? "Đang xem phim" : itemBookings.status === "HUYTOUR" ? "Đã hủy" : itemBookings?.status === "DAHOANTHANH" && "Đã hoàn thành"}</span></p>

					</div>

				</div>
			</Modal>
		</>
	)
}

export default ModalViewBookings

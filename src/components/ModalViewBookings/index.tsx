
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'

import bookingAPI from "@/services/bookings.service";
import dayjs from "dayjs";
import Tours from "@/pages/Tours";

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
				<div className="flex justify-between p-[20px]">
					<div className="w-[50%] mr-[20px]">
						<img className="w-full h-full" src="//cdn2.ivivu.com/2022/06/24/17/ivivu-chiang-mai-travel-360x225.gif" alt="" />
					</div>
					<div className="w-[50%]">
						<p className="mb-[10px]">Tên tour : {itemBookings?.tours?.tourName}</p>
						<p className="mb-[10px]">Người đặt : {itemBookings?.user?.name}</p>
						<p className="mb-[10px]">Tổng tiền : {itemBookings?.user?.name}</p>
						<p className="mb-[10px]">Ngày đặt : {itemBookings?.createdAt && formatDate(itemBookings?.createdAt, "DD/MM/YYYY HH:mm:ss")}</p>
						<p className="mb-[10px]">Ngày khởi hành : {itemBookings?.createdAt && formatDate(itemBookings?.createdAt, "DD/MM/YYYY")}</p>
						<p className="mb-[10px]">Trạng thái : {itemBookings?.status}</p>

					</div>

				</div>
			</Modal>
		</>
	)
}

export default ModalViewBookings

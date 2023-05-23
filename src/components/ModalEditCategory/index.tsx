import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import categoriesAPI from "@/services/categories.service";

type IProps = {
	itemCategory: Object | any
	showModalEdit: boolean
	setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const schema = yup.object().shape({
	name: yup.string().required("Vui lòng loại tour"),
	description: yup.string().required("Vui lòng nhập description")
})

const ModalEditCategory = ({ showModalEdit, setShowModalEdit, itemCategory, callBack }: IProps) => {

	const {
		register,
		handleSubmit,
		formState,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: itemCategory?.name,
			description: itemCategory?.description,
		}
	})

	const { errors, isDirty }: any = formState;

	const updatePost = async (data: any) => {
		try {
			const res = await categoriesAPI.updateCategories(itemCategory?.id, {
				name: data?.name,
				description: data?.description
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

	useEffect(() => {
		reset({
			name: itemCategory?.name,
			description: itemCategory?.description,
		})
	}, [itemCategory, setShowModalEdit, showModalEdit])
	return (
		<>
			<Modal
				title="Sửa thông tin loại tour"
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
								Loại tour:
							</span>
							<div className="flex-1">
								<input
									placeholder="Nhập loại tour"
									type="text"
									{...register("name")}
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
				</div>
			</Modal>
		</>
	)
}

export default ModalEditCategory

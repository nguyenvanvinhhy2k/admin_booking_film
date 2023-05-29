import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import tourAPI from '@/services/tours.service'
import ModalAddTour from '@/components/ModalAddTour'
import ModalEditTour from '@/components/ModalEditTour'
import useQueryParams from '@/hooks/useQueryParams'
import categoriesAPI from '@/services/categories.service'
import dayjs from "dayjs";
import { useAuth } from '@/contexts/auth'

const Tours = () => {
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [itemTours, setItemTours] = useState<any>({});
  const [idTours, setIdTours] = useState<any>();
  const [tours, setTours] = useState<any>([]);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [params, setQueryParams] = useQueryParams()
	const { page, size, _q } = params
	const { user } = useAuth()

  const getDataListTours = async () => {
    try {
      const [data, category ] = await Promise.all([
				tourAPI.getTour({ page: page, _q: _q, size: size}),
				categoriesAPI.getCategories({ page: 1, size: 999})
			])

			const newData: any = data?.data?.data?.map((item: any) => {
				return {
					...item,
					cateName: category?.data?.data?.find((itemCate: any) => itemCate?.id === item?.cateId).name
				}
			})
      setTours(newData)
			setTotalItem(data?.data?.total)
    } catch (error) {
      console.log(error)
    }
  }


  const handleConfirmDelete = async () => {
    try {
			const res = await tourAPI.deleteTour(idTours)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListTours()
			}
		} catch (error) {
			console.log(error)
		}
  }

	const searchTour = async () => {
		setQueryParams({
			...params, page: 1, size: size
		}, true)
		try {
			const data = await tourAPI.getTour({ page: page, _q: _q, size: size})
      setTours(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const formatDate = (date: Date, format: string) => {
		return dayjs(date).format(format);
	}

  const handleStatus = (id: any) => {
		setShowModalDelete(true)
    setIdTours(id)
	}

  const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemTours(item)
	}

	useEffect(() => {
		if (_q) {
			getDataListTours()
		}
	}, [page, size])

	useEffect(() => {
		if (!_q) {
			getDataListTours()
		}
	}, [_q, page, size])

  return (
    <>
    	<ModalAddTour
				showModalAdd={showModalAdd}
				setShowModalAdd={setShowModalAdd}
				callBack={() => {
					getDataListTours()
				}}
			/>
      <ModalEditTour
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemTours={itemTours}
				callBack={() => {
					getDataListTours()
				}}
			/>
      <Modal
				title="Xóa user"
				open={showModalDelete}
				handleCancel={() => setShowModalDelete(false)}
				handleConfirm={handleConfirmDelete}
			>
				Bạn chắc chắn muốn Xóa tour này chứ?
			</Modal>
      <div className="wrapper">
        <div className="wrapper-box">
          <div className="content">
            <div className="intro-y flex items-center mt-8">
              <h2 className="text-lg font-medium mr-auto">Danh sách Tours</h2>
            </div>
            <div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
              <div className="intro-y col-span-12 lg:col-span-6">
                {/* BEGIN: Basic Table */}
                <div className="intro-y box">
                <div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
											<div className="flex items-center">
											{user?.role === "ADMIN" ? (
												<div className="btn btn-primary mr-2 shadow-md w-full" onClick={() => setShowModalAdd(true)}>
												<span className="flex h-4 w-8 items-center justify-center">
													<Plus />
												</span>
												Thêm mới
											</div>)
												: ("") }
											</div>
										<div className="flex items-center font-medium ">
											<div className="flex items-center gap-5 flex-wrap justify-end">
												<div className="w-60 relative text-slate-500">
													<InputSearchDebounce
                            onChange={(input: string) => setQueryParams({ ...params, page: page, size: size, _q: input?.trim() }, true)}
														placeholder="Từ khóa"
														className="form-control box pr-10 w-56 flex-end"
														delay={400}
													/>
												</div>

												<div>
													<button onClick={searchTour} className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
														Tìm
													</button>
												</div>

											</div>
										</div>
									</div>
                  <div className="p-5" id="basic-table">
                    <div className="preview">
                      <div className="mt-8 overflow-auto">
                        <table className="table">
                          <thead className="table-dark">
                            <tr className="text-center">
                              <th className="whitespace-nowrap">ID</th>
                              <th className="whitespace-nowrap">Tên tour</th>
                              <th className="whitespace-nowrap">Loại tour</th>
															<th className="whitespace-nowrap">Ảnh poster</th>
                              <th className="whitespace-nowrap">Ảnh banner</th>
                              <th className="whitespace-nowrap">Mô tả</th>
                              <th className="whitespace-nowrap">Thời gian bắt đầu</th>
                              <th className="whitespace-nowrap">Thời gian kết thúc</th>
                              <th className="whitespace-nowrap">Giá tiền</th>
															<th className="whitespace-nowrap">Số lượng</th>
															<th className="whitespace-nowrap">Phương tiện</th>
															<th className="whitespace-nowrap">Xuất phát</th>
                              <th className="whitespace-nowrap">Địa điểm</th>
															<th className="whitespace-nowrap">Các ngày đặt</th>
															<th className="whitespace-nowrap">Chức năng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              tours?.map((item: any) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{item.id}</td>
                                      <td>{item.tourName}</td>
                                      <td>{item?.cateName}</td>
																			<td><img src={`http://localhost:8228/files/${item.poster}`} alt="" /></td>
                                      <td><img src={`http://localhost:8228/files/${item?.banner}`} alt="" /></td>
                                      <td>{item.description}</td>
                                      <td>{item?.startDate && formatDate(item?.startDate, "DD/MM/YYYY")}</td>
                                      <td>{item?.endDate && formatDate(item?.endDate, "DD/MM/YYYY")}</td>
                                      <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price)}</td>
																			<td>{item.capacity}</td>
																			<td>{item.transport}</td>
                                      <td>{item.startLocation}</td>
                                      <td>{item?.listLocation}</td>
																			<td>{item?.listDate}</td>
                                      <td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
                                        <div className="flex items-center justify-between">
                                          <div className={ `font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} onClick={() => {if(user?.role === "ADMIN") handleUpdate(item)} }>
                                            <div className='inline-block' />
                                            <Edit className='mr-1.5 inline-block' size={16} />
                                            <div>
                                            </div>
                                          </div>
                                          <div className={ `font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} onClick={() => {if(user?.role === "ADMIN") handleStatus(item.id)}}>
                                            <div className="flex items-center justify-start text-danger">
                                              <Trash2 className="mr-1.5" size={20} />
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                )
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Content */}
        </div>
      </div>
      <div className="flex justify-between w-full mt-10">
			<Pagination
									pageNumber={page}
									pageSize={size}
									totalRow={totalItem}
									onPageChange={(page) => setQueryParams({ page })}
									onChangePageSize={(size) => setQueryParams({ size })}
								/>
      </div>
    </>
  )
}

export default Tours

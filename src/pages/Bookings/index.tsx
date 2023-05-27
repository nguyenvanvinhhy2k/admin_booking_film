import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Eye, Plus, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import ticketAPI from '@/services/tours.service'
import ModalEditTicket from '@/components/ModalEditCategory'
import ModalAddTicket from '@/components/ModalAddCategory'
import bookingAPI from '@/services/bookings.service'

const Bookings = () => {
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [itemBookings, setItemBookings] = useState<any>({});
  const [idBookings, setIdBookings] = useState<any>();
  const [bookings, setBookings] = useState<any>([]);

  const getDataListBookings = async () => {
    try {
      const data = await bookingAPI.getBookings()
      setBookings(data?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
			const res = await bookingAPI.deleteBookings(idBookings)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListBookings()
			}
		} catch (error) {
			console.log(error)
		}
  }

  const handleStatus = (id: any) => {
		setShowModalDelete(true)
    setIdBookings(id)
	}

  const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemBookings(item)
	}

  useEffect(() => {
    getDataListBookings()
  }, [])

  return (
    <>
    	{/* <ModalAddTicket
				showModalAdd={showModalAdd}
				setShowModalAdd={setShowModalAdd}
				callBack={() => {
					getDataListBookings()
				}}
			/>
      <ModalEditTicket
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemTicket={itemBookings}
				callBack={() => {
					getDataListBookings()
				}}
			/> */}
      <Modal
				title="Xóa booking tour"
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
              <h2 className="text-lg font-medium mr-auto">Danh sách booking</h2>
            </div>
            <div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
              <div className="intro-y col-span-12 lg:col-span-6">
                {/* BEGIN: Basic Table */}
                <div className="intro-y box">
                <div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
											<div className="flex items-center">
												<div className="btn btn-primary mr-2 shadow-md w-full" onClick={() => setShowModalAdd(true)}>
													<span className="flex h-4 w-8 items-center justify-center">
														<Plus />
													</span>
													Thêm mới
												</div>
											</div>
										<div className="flex items-center font-medium ">
											<div className="flex items-center gap-5 flex-wrap justify-end">
												<div className="w-60 relative text-slate-500">
													<InputSearchDebounce
                            onChange={() => null}
														placeholder="Từ khóa"
														className="form-control box pr-10 w-56 flex-end"
														delay={400}
													/>
												</div>

												<div>
													<button className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
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
                              <th className="whitespace-nowrap">Người đặt</th>
                              <th className="whitespace-nowrap">Thời gian đặt</th>
                              <th className="whitespace-nowrap">Ngày khởi hành</th>
                              <th className="whitespace-nowrap">Trạng thái</th>
                              <th className="whitespace-nowrap">Operation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              bookings?.map((item: any) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{item.id}</td>
                                      <td>{item.user.name}</td>
                                      <td>{item.createdAt}</td>
                                      <td>{item.bookingDate}</td>
                                      <td>{item.status}</td>
                                      <td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
                                        <div className="flex items-center justify-between">
																				<div className=" cursor-pointer font-semibold text-sky-600 hover:opacity-60 flex items-center" onClick={() => handleUpdate(item)}>
                                            <div className='inline-block' />
                                            <Eye className='mr-1.5 inline-block' size={16} />
                                            <div>
                                            </div>
                                          </div>
                                          <div className="cursor-pointer font-semibold text-sky-600 hover:opacity-60 flex items-center" onClick={() => handleUpdate(item)}>
                                            <div className='inline-block' />
                                            <Edit className='mr-1.5 inline-block' size={16} />
                                            <div>
                                            </div>
                                          </div>
                                          <div className="cursor-pointer font-semibold text-danger  hover:opacity-60 flex items-center" onClick={() => handleStatus(item.id)}>
                                            <div className="flex items-center justify-start text-danger">
                                              <X className="mr-1.5" size={20} />
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
          pageNumber={1}
          pageSize={1}
          totalRow={1}
          onPageChange={() => null}
          onChangePageSize={() => null}
        />
      </div>
    </>
  )
}

export default Bookings

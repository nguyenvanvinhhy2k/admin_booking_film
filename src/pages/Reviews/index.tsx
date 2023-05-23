import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Plus, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import ModalEditTicket from '@/components/ModalEditCategory'
import ModalAddTicket from '@/components/ModalAddCategory'
import reviewAPI from '@/services/reviews.service'

const Reviews = () => {
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [itemReviews, setItemReviews] = useState<any>({});
  const [idReviews, setIdReviews] = useState<any>();
  const [reviews, setReviews] = useState<any>([]);

  const getDataListReviews = async () => {
    try {
      const data = await reviewAPI.getReviews()
      setReviews(data?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
			const res = await reviewAPI.deleteReviews(idReviews)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListReviews()
			}
		} catch (error) {
			console.log(error)
		}
  }

  const handleStatus = (id: any) => {
		setShowModalDelete(true)
    setIdReviews(id)
	}

  const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemReviews(item)
	}

  useEffect(() => {
    getDataListReviews()
  }, [])

  return (
    <>
    	<ModalAddTicket
				showModalAdd={showModalAdd}
				setShowModalAdd={setShowModalAdd}
				callBack={() => {
					getDataListReviews()
				}}
			/>
      <ModalEditTicket
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemTicket={itemReviews}
				callBack={() => {
					getDataListReviews()
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
                              <th className="whitespace-nowrap">Họ tên</th>
                              <th className="whitespace-nowrap">Username</th>
                              <th className="whitespace-nowrap">Role</th>
                              <th className="whitespace-nowrap">Email</th>
                              <th className="whitespace-nowrap">SĐT</th>
                              <th className="whitespace-nowrap">Operation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              reviews?.map((item: any) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{item.id}</td>
                                      <td>{item.name}</td>
                                      <td>{item.username}</td>
                                      <td>{item.role}</td>
                                      <td>{item.email}</td>
                                      <td>{item.phoneNumber}</td>
                                      <td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
                                        <div className="flex items-center justify-around">
                                          <div className="cursor-pointer font-semibold text-sky-600 hover:opacity-60 flex items-center" onClick={() => handleUpdate(item)}>
                                            <div className='inline-block' />
                                            <Edit className='mr-1.5 inline-block' size={16} />
                                            <div>
                                              <span>Sửa</span>
                                            </div>
                                          </div>
                                          <div className="w-[50px] cursor-pointer font-semibold text-danger  hover:opacity-60 flex items-center ml-[20px]" onClick={() => handleStatus(item.id)}>
                                            <div className="flex items-center justify-start text-danger">
                                              <X className="mr-1.5" size={20} />
                                              Xóa
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

export default Reviews

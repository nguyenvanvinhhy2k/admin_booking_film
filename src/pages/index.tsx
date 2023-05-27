
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { BookOpen, Bookmark, FileQuestion, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import tourAPI from '@/services/tours.service';
import categoriesAPI from '@/services/categories.service';
import bookingAPI from '@/services/bookings.service';
import reviewAPI from '@/services/reviews.service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
	const [data, setData] = useState<any>({
    labels: [],
    datasets: [{}]
  })

	const [tours, setTours] = useState<any>()
	const [category, setCategory] = useState<any>()
	const [booking, setBooking] = useState<any>()
	const [review, setReview] = useState<any>()
	const [booinge, setBooinge] = useState<any>({
    labels: [],
    datasets: [{}]
  })

	console.log(booinge)

	const getStatistical = async () => {
		const [tour, category, booking, review, booinge] =	await Promise.all([
			tourAPI.getTour(),
			categoriesAPI.getCategories(),
			bookingAPI.getBookings(),
			reviewAPI.getReviews(),
			bookingAPI.getMoviesBooinges()
		]);

		let labels = booinge?.data?.data?.map((tourName: any) => {
			if (tourName?.tourName?.length > 20) return tourName.tourName.substring(0, 20) + '...';
      return tourName.tourName
    })

		let datasets = [
      {
        label: 'Số lượng đặt',
        data: booinge?.data?.data?.map((item: any) => item.numberBooking)
      }
    ]
    const dataChart = {
      labels,
      datasets
    }

		setBooinge(dataChart)
		setTours(tour?.data?.total)
		setCategory(category?.data?.total)
		setBooking(booking?.data?.total)
		setReview(review?.data?.total)
	}

	const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 10 tour được đặt nhiều nhất',
        font: {
          size: 20
        }
      },
    },
    barPercentage: 1,
    categoryPercentage: 0.5,
  };

	useEffect(() => {
		getStatistical()
	},[])
  return (
    <div className="wrapper">
        <div className="wrapper-box">
          <div className="content">
            <div className="intro-y flex items-center mt-8">
              <h2 className="text-xl font-bold mr-auto">Trang chủ</h2>
            </div>
            <div className="grid grid-cols-24 gap-6 mt-1 ">
              <div className="intro-y col-span-12 lg:col-span-6">
                <div className="grid grid-cols-12 gap-6 mt-5">
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <Link to={'/tours'} >
                      <div className="report-box zoom-in">
                        <div className="box p-5">
                          <div className="flex">
                            <div className="side-menu__icon text-blue-500 font-bold"><Type /></div>
                          </div>
                          <div className="text-3xl font-medium leading-8 mt-6">{tours}</div>
                          <div className="text-base text-slate-500 mt-1">Tours</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/categories'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-green-500 font-bold"><BookOpen /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{category}</div>
                        <div className="text-base text-slate-500 mt-1">Loại tour</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/bookings'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-red-500 font-bold"><Bookmark /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{booking ? booking : 0}</div>
                        <div className="text-base text-slate-500 mt-1">Booktour</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/reviews'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-yellow-500 font-bold"><FileQuestion /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{review ? review : 0}</div>
                        <div className="text-base text-slate-500 mt-1">Đánh giá</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-5">
              <div className="grid grid-cols-2 gap-6 mt-1 ">
                <div className="col-span-2">
                  <div className="intro-y block sm:flex items-center h-10 my-7">
                    <h2 className="text-lg font-medium truncate mr-5">
                      Biều đồ thống kê booking tour
                    </h2>
                  </div>
                  <div className=" bg-white p-5">
                    <div className="w-full mx-auto">
                      {
                        booinge?.labels?.length ? <Bar options={options} data={booinge} /> : <>Không có dữ liệu ...</>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

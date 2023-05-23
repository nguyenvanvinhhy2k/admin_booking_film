import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from 'components/Layout'
import PrivateRouter from './privateRouter'

const SignIn = lazy(() => import('../pages/Signin'))
const SignUp = lazy(() => import('../pages/SignUp'))
const Home = lazy(() => import('../pages/index'))
const Users = lazy(() => import('../pages/Users'))
const Tours = lazy(() => import('../pages/Tours'))
const Bookings = lazy(() => import('../pages/Bookings'))
const Categories = lazy(() => import('../pages/Categories'))
const Reviews = lazy(() => import('../pages/Reviews'))

const AppRouter = () => {
	return (
		<Routes>
			<Route>
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
			</Route>
			<Route
				path="/"
				element={
					<Suspense>
					 {/* <PrivateRouter > */}
						<Layout>
							<Home />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/users"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Users />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/tours"
				element={
					<Suspense>
						 <PrivateRouter >
						<Layout>
							<Tours />
						</Layout>
						</PrivateRouter>
					</Suspense>
				}
			/>
			<Route
				path="/categories"
				element={
					<Suspense>
						 <PrivateRouter >
						<Layout>
							<Categories />
						</Layout>
						</PrivateRouter>
					</Suspense>
				}
			/>
			<Route
				path="/bookings"
				element={
					<Suspense>
						 <PrivateRouter >
						<Layout>
							<Bookings />
						</Layout>
						</PrivateRouter>
					</Suspense>
				}
			/>
			<Route
				path="/reviews"
				element={
					<Suspense>
						 <PrivateRouter >
						<Layout>
							<Reviews />
						</Layout>
						</PrivateRouter>
					</Suspense>
				}
			/>
		</Routes>
	)
}

export default AppRouter

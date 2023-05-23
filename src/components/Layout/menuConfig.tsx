
export interface Menu {
  id: number
  name: string
  slug: string
	patchChildren?: Array<string>
}

export const menuConfig: Menu[] = [
	{
    id: 6,
    name: 'Trang chủ',
    slug: '/',
  },
  {
    id: 2,
    name: 'Quản lý Tours',
    slug: '/tours'
  },
  {
    id: 3,
    name: 'Quản lý Loại Tour',
    slug: '/categories'
  },
	{
    id: 4,
    name: 'Quản lý Bookings',
    slug: '/bookings'
  },
  {
    id: 5,
    name: 'Quản lý Reviews',
    slug: '/reviews'
  },
	{
    id: 1,
    name: 'Quản lý Users',
    slug: '/users',
  }
]

export const mathRouteConfig = [{ path: "/users/:id" }]

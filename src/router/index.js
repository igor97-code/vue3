import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

const Layout = () => import(/* webpackChunkName: "Layout" */ '@/views/Layout/LayoutComponent')
const DriversPage = () => import(/* webpackChunkName: "DriversPage" */ '@/views/DriversPage/IndexComponent')
const DriversTableView = () => import(/* webpackChunkName: "DriversTableView" */ '@/views/DriversPage/DriversTableView/IndexComponent')
const DriverInfoView = () => import(/* webpackChunkName: "DriverInfoView" */ '@/views/DriversPage/DriverInfoView/IndexComponent')
const HomePage = () => import(/* webpackChunkName: "HomePage" */ '@/views/HomePage/IndexComponent')
const NeedsCalculatorPage = () => import(/* webpackChunkName: "NeedsCalculatorPage" */ '@/views/NeedsCalculatorPage/IndexComponent')
const QuotasPage = () => import(/* webpackChunkName: "QuotasPage" */ '@/views/QuotasPage/IndexComponent')
const SchedulerPage = () => import(/* webpackChunkName: "SchedulerPage" */ '@/views/SchedulerPage/IndexComponent')
const FilialsPage = () => import(/* webpackChunkName: "FilialsPage" */ '@/views/FilialsPage/IndexComponent')
const NotificationsPage = () => import(/* webpackChunkName: "NotificationsPage" */ '@/views/NotificationsPage/IndexComponent')
const LogsPage = () => import(/* webpackChunkName: "LogsPage" */ '@/views/LogsPage/IndexComponent')
const DashboardPage = () => import(/* webpackChunkName: "DashboardPage" */ '@/views/DashboardPage/IndexComponent')
const ActiveLegsPage = () => import(/* webpackChunkName: "ActiveLegsPage" */ '@/views/ActiveLegsPage/IndexComponent')
const ActiveLegsList = () => import(/* webpackChunkName: "ActiveLegsList" */ '@/views/ActiveLegsPage/ActiveLegsList/IndexComponent')
const ActiveLegInfo = () => import(/* webpackChunkName: "ActiveLegInfo" */ '@/views/ActiveLegsPage/ActiveLegInfo/IndexComponent')
const LoginPage = () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage/IndexComponent')
const NotFoundPage = () => import(/* webpackChunkName: "NotFoundPage" */ '@/views/ErrorPages/NotFoundPage')
const ServerErrorPage = () => import(/* webpackChunkName: "ServerErrorPage" */ '@/views/ErrorPages/ServerErrorPage')
const CreatePasswordPage = () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage/CreatePassword')
const RecoveryPasswordPage = () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage/RecoveryPassword')

const routes = [
	{
		path: '/',
		name: '',
		redirect: () => ({ name: 'home' }),
		component: Layout,
		children: [
			{
				path: '/drivers',
				name: 'drivers',
				redirect: () => ({ name: 'drivers-table' }),
				component: DriversPage,
				meta: {
					title: 'Водители'
				},
				children: [
					{
						path: '',
						name: 'drivers-table',
						component: DriversTableView
					},
					{
						path: ':driverId',
						name: 'driver-info',
						component: DriverInfoView,
						meta: {
							title: ref('Информация о водителе')
						}
					}
				]
			},
			{
				path: 'home',
				name: 'home',
				component: HomePage
			},
			{
				path: 'needs-calculator',
				name: 'needs-calculator',
				component: NeedsCalculatorPage
			},
			{
				path: 'quotas',
				name: 'quotas',
				component: QuotasPage
			},
			{
				path: 'scheduler',
				name: 'scheduler',
				component: SchedulerPage
			},
			{
				path: 'filials',
				name: 'filials',
				component: FilialsPage
			},
			{
				path: 'notifications',
				name: 'notifications',
				component: NotificationsPage
			},
			{
				path: 'logs',
				name: 'logs',
				component: LogsPage
			},
			{
				path: 'dashboard',
				name: 'dashboard',
				component: DashboardPage
			},
			{
				path: 'active-legs',
				name: 'active-legs',
				redirect: () => ({ name: 'active-legs-list' }),
				component: ActiveLegsPage,
				children: [
					{
						path: '',
						name: 'active-legs-list',
						component: ActiveLegsList
					},
					{
						path: ':legId',
						name: 'active-leg-info',
						component: ActiveLegInfo,
						meta: {
							title: 'Активное плечо'
						}
					}
				],
				meta: {
					title: 'Активные плечи'
				}
			}
		],
	},
	{
		path: '/login',
		name: 'login',
		component: LoginPage
	},
	{
		path: '/create-password',
		name: 'create-password',
		component: CreatePasswordPage
	},
	{
		path: '/recovery-password',
		name: 'recovery-password',
		component: RecoveryPasswordPage
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: '404' }
	},
	{
		path: '/404',
		name: '404',
		component: NotFoundPage
	},
	{
		path: '/500',
		name: '500',
		component: ServerErrorPage
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router

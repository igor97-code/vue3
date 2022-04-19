import axios from 'axios'
import router from '@/router'

const client = axios.create({
	baseURL: '/userportal'
})

let refreshRequest = null

client.interceptors.request.use(
	config => {
		const accessToken = localStorage.getItem('accessToken')

		if (!accessToken) {
			return config
		}

		const newConfig = {
			headers: {},
			...config
		}

		newConfig.headers.Authorization = `Bearer ${accessToken}`

		return newConfig
	}, 
	error => {
		return Promise.reject(error)
	}
)

client.interceptors.response.use(
	response => response, 
	async error => {
		if (error.config.refreshUnnecessary) {
			throw error
		}
		
		const refreshToken = localStorage.getItem('refreshToken')
		
		if (error.response.status !== 401) {
			throw error
		} else if (!refreshToken && !refreshRequest) {
			router.push({ name: 'login' })
			throw error
		}

		if (!refreshRequest) {
			refreshRequest = client
				.post('/api/v1/refresh', { refreshToken }, { baseURL: '/auth', refreshUnnecessary: true })
		}

		try {
			const { data } = await refreshRequest
			
			localStorage.setItem('accessToken', data.resp.accessToken)
			localStorage.setItem('refreshToken', data.resp.refreshToken)

			const newRequest = {
				...error.config
			}

			return client(newRequest)
		} catch(error) {
			router.push({ name: 'login' })

			throw error
		} finally {
			refreshRequest = null
		}
	}
)

export class ApiBase {
	constructor() {
		this.client = client
	}
}
import { ApiBase } from '../apiBase'

class API extends ApiBase {
	baseURL = '/auth'

	login({ password, username }) {
		return this.client
			.post('/api/v1/login', { username, password }, { baseURL: this.baseURL, refreshUnnecessary: true })
	}

	forgotPassword(username) {
		return this.client.post('/api/v1/forgot-password', {username}, { baseURL: this.baseURL, refreshUnnecessary: true })
			.then(({data}) => {
				return data
			})
	}

	resetPassword(data) {
		return this.client.post('/api/v1/reset-password', data, { baseURL: this.baseURL, refreshUnnecessary: true })
			.then(({data}) => {
				return data
			})
	}
}

export default new API()
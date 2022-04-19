import { ApiBase } from '../apiBase'

class API extends ApiBase {
	baseURL = '/api/v1'

	getDrivers(filters = {}, queryParams) {
		let query = new URLSearchParams(queryParams).toString()

		return this.client
			.post(`${this.baseURL}/drivers?${query}`, filters)
	}

	getDriversFilter() {
		return this.client
			.get(`${this.baseURL}/driver-filter`)
	}

	getDriverInfoById(id) {
		return this.client
			.get(`${this.baseURL}/drivers/${id}`)
	}
}

export default new API()
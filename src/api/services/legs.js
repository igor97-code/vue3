import { ApiBase } from '../apiBase'
import dayjs from 'dayjs'

//TODO: заменить на дату текущего дня
const defaultDate = dayjs().startOf('date').format('YYYY-MM-DD')

class API extends ApiBase {
	baseURL = '/api/v1'

	getLegsFilter() {
		return this.client
			.get(`${this.baseURL}/leg-filter`)
	}
	
	getLegsList(filters, date = defaultDate) {
		return this.client
			.post(
				`${this.baseURL}/legs?date=${date}`,
				filters
			)
	}

	getLeg(legId, date = defaultDate) {
		return this.client
			.get(`${this.baseURL}/legs/${legId}?date=${date}`)
	}

	getLegEvents(legId, payload = {}, date = defaultDate) {
		return this.client
			.post(`${this.baseURL}/legs/${legId}/events?date=${date}`, payload)
	}

	getEventTypes() {
		return this.client
			.get(`${this.baseURL}/events/types`)
	}
}

export default new API()
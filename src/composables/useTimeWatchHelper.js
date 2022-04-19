import { pluralize } from '@/utils'

import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'

export const useTimeWatchHelper = (updateFn, updateInterval = 2) => {
	const currentTime = ref(dayjs())
	const lastTimeWebUpdated = ref(null)
	const lastTimeBackUpdated = ref(null)
	const interval = ref(null)

	const dateUpdatedText = computed(() => {
		if (!lastTimeBackUpdated.value) {
			return 'не определо'
		}
		
		let result = []

		const diff = currentTime.value.diff(lastTimeBackUpdated.value, 'minutes')
		const minutesDiff = diff % 60
		const hoursDiff = Math.floor(diff / 60)

		if (hoursDiff > 0) {
			result.push(`${hoursDiff} ${pluralize(hoursDiff, ['час', 'часа', 'часов'])}`)
		}

		if (minutesDiff > 0) {
			result.push(`${minutesDiff} ${pluralize(minutesDiff, ['минуту', 'минуты', 'минут'])}`)
		}

		if (!result.length) {
			result.push('менее минуты')
		}

		return `${result.join(' и ')} назад`
	})

	if (updateFn) {
		watch(
			currentTime,
			date => {
				if (date.diff(lastTimeWebUpdated.value, 'minutes') === updateInterval) {
					updateFn()
				}
			}
		)
	}

	onMounted(() => {
		interval.value = setInterval(() => {
			currentTime.value = dayjs()
		}, 1000)
	})

	onBeforeUnmount(() => {
		clearInterval(interval.value)
	})

	return {
		currentTime,
		dateUpdatedText,
		lastTimeWebUpdated,
		lastTimeBackUpdated
	}
}
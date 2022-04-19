<template>
	<div
		v-loading="isLoading"
		class="info"
	>
		<div
			class="general-info"
		>
			<div class="general-info__header">
				<h3>
					Общая информация
				</h3>

				<div class="general-info__icons">
					<el-button
						class="icon-button"
						size="large"
					>
						<draw-icon />
					</el-button>

					<el-button
						class="icon-button"
						size="large"
					>
						<mail-icon />
					</el-button>

					<el-button
						class="icon-button"
						size="large"
					>
						<truck-icon />
					</el-button>

					<el-button
						class="icon-button__text"
						size="large"
					>
						<span>Рейсы</span>
					</el-button>
				</div>
			</div>
			<div class="general-info__content">
				<div class="general-info__content-item">
					<div class="content-item">
						<h4>Водитель</h4>

						<div class="content-item__info">
							<span>ФИО</span>

							<span>{{ driverInfo.fullName }}</span>
						</div>

						<div class="content-item__info">
							<span>Рабочий телефон</span>

							<span>{{ driverInfo.contactPhone }}</span>
						</div>

						<div class="content-item__info">
							<span>Контактный телефон</span>

							<span>{{ driverInfo.contactPhone }}</span>
						</div>
					</div>

					<div class="content-item">
						<div class="content-item__info">
							<span>Направление</span>

							<span>{{ driverInfo.supply.name }}</span>
						</div>

						<div class="content-item__info">
							<span>Контрагент</span>

							<span>{{ driverInfo.carrier.carrierTypeString }}</span>
						</div>

						<div class="content-item__info">
							<span>Время работы</span>

							<span>{{ driverInfo.startWorkTime }} - {{ driverInfo.endWorkTime }}</span>
						</div>

						<div class="content-item__info">
							<span>Наличие ЦД</span>

							<span>{{ driverInfo.electronicDispatcher }}</span>
						</div>
					</div>

					<div class="content-item">
						<div class="content-item__info">
							<span>Активность</span>

							<span>{{ driverInfo.activity }}</span>
						</div>

						<div class="content-item__info">
							<span>Версия приложения</span>
							<!-- TODO Добавить версию, когда узнают что это такое. -->
							<span>23.1245</span>
						</div>
					</div>
				</div>

				<div class="general-info__content-item">
					<div class="content-item">
						<h4>Транспорт</h4>

						<div class="content-item__info">
							<span>Гос. номер автомобиля</span>

							<span>{{ driverInfo.vehicle.vehicleNumber }}</span>
						</div>

						<div class="content-item__info">
							<span>Гос. номер прицепа</span>

							<span>{{ driverInfo.vehicle.trailerNumber }}</span>
						</div>

						<div class="content-item__info">
							<span>Характеристики</span>

							<span>{{ driverInfo.vehicle.vehicleType }}</span>
						</div>
					</div>
				</div>
				<el-button 
					class="btn-delete icon-button__text"
					size="large"
				>
					Удалить водителя
				</el-button>
			</div>
		</div>

		<TabsInfo />
	</div>
</template>

<script>
import { drivers } from '@/api'
import TabsInfo from './TabsInfoComponent.vue'
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import DrawIcon from '@/assets/icons/draw-icon.svg?inline'
import MailIcon from '@/assets/icons/mail-icon.svg?inline'
import TruckIcon from '@/assets/icons/truck-icon.svg?inline'
import { formatPhoneNumber } from '@/utils'

export default {
	name: 'InfoDrivers',
	components: {
		TabsInfo,
		DrawIcon,
		MailIcon,
		TruckIcon
	},
	setup() {
		const isLoading = ref(false)
		const route = useRoute()
		const driverInfo = ref()

		const setDriverInfo = data => {
			driverInfo.value = {
				fullName: data?.fullName || '-',
				contactPhone: data?.contactPhone ? formatPhoneNumber(data.contactPhone) : '-',
				electronicDispatcher: data?.electronicDispatcher ? 'С цифровым диспетчером' : 'Отсутствует',
				carrier: {
					carrierTypeString: data?.carrier.carrierTypeString || '-',
					name: data?.carrier.name || '-',
				},
				startWorkTime: data?.startWorkTime || 'Не определено',
				endWorkTime: data?.endWorkTime || 'Не определено',
				activity: data?.status ? 'Активен' : 'Неактивен',
				vehicle: {
					vehicleNumber: data?.vehicle.vehicleNumber || '-',
					trailerNumber: data?.vehicle.trailerNumber || '-',
					vehicleType: data?.vehicle.vehicleType || '-'
				},
				supply: {
					name: data?.supply?.name || 'Не определено'
				}
			}
		}

		const getDriverInfo =  async () => {
			route.meta.title.value = 'Информация о водителе'
			try {
				isLoading.value = true
				const { data } = await drivers.getDriverInfoById(route.params.driverId)

				setDriverInfo(data.resp)

				route.meta.title.value = driverInfo.value.fullName
			} catch(error) {
				console.error(error)
			} finally {
				isLoading.value = false
			}
		}
		
		onBeforeMount(() => {
			setDriverInfo()
			getDriverInfo()
		})

		return {
			driverInfo,
			isLoading
		}
	}
}
</script>

<style lang="scss" scoped>

.info {
	display: flex;
	padding: theme-space(m);

	.general-info {
		max-width: 632px;
		flex-grow: 1;

		&__icons {
			display: flex;
			gap: theme-space(xs);
		}

		&__header {
			display: flex;
			justify-content: space-between;
			color: theme-color(gray-700);
			font-weight: 500;
			line-height: 24px;
		}

		&__content {
			margin: theme-space(xs) 0;

			&-item {
				padding: theme-space(m);
				background: theme-color(primary-lightest);
				margin-bottom: theme-space(xs);
				border-radius: 16px;
				line-height: 20px;
				color: theme-color(gray-700);

				.content-item {
					margin-bottom: 44px;

					h4 {
						margin: 0 0 20px 0;
						font-size: 16px;
						color: theme-color(gray-700);
						font-weight: 500;
						line-height: 24px;
					}

					&__info {
						display: flex;
						
						&:not(:last-child) {
							margin-bottom: 20px;
						}

						span {
							width: 50%;
							color: theme-color(gray-500);
							font-weight: 400;
							line-height: 24px;

							&:last-of-type{
								color: theme-color(gray-700);
							}
						}
					}

					&:last-child{
						margin-bottom: 0;
					}
				}
			}
		}
	}
}
.icon-button {
	margin-left: 0;

	&__text {
		margin-left: 0;
		padding: 8px 16px;
		color: theme-color(gray-500);
	}
}
.btn-delete {
	float: right;
}

</style>
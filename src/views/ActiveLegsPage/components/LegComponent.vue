<template>
	<div
		v-if="legData"
		class="active-leg"
	>
		<header class="head">
			<div class="head__left">
				<el-icon 
					v-if="isCollapsable" 
					class="head__arrow"
					:class="{'head__arrow_collapse': !isCollapsed}"
					@click="collapse"
				>
					<arrow-up-icon />
				</el-icon>

				<div class="head__label">
					{{ legData.field.name }}
				</div>

				<div class="head__circle" />

				<div class="head__info">
					<span class="head_bold">
						{{ legData.distance }}
					</span>

					км
				</div>

				<div class="head__info">
					<span class="head_bold">~ 58</span>

					мин
				</div>

				<div class="head__circle" />

				<div class="head__info head__number-drivers">
					<template v-if="currentDrivers < plannedDrivers">
						<span
							class="head__current-drivers head_bold head__current-drivers_error"
						>
							{{ currentDrivers }}
						</span>
						
						<div
							class="head__drivers-group"
						>
							из
							<span class="head__necessary-drivers head_bold">
								{{ plannedDrivers }}
							</span>
							водителей
						</div>
					</template>

					<template v-else>
						<span
							class="head__current-drivers head_bold"
						>
							{{ currentDrivers }}
						</span>
						<div
							class="head__drivers-group"
						>
							водителей
						</div>
					</template>
				</div>
			</div>

			<div class="head__right">
				<router-link
					v-if="btnReserve && currentDrivers < plannedDrivers"
					:to="{ name: 'drivers', query: { 'working-time': '08:00,21:00' } }"
					class="head__link"
				>
					<button
						v-if="btnReserve && currentDrivers < plannedDrivers"
						class="head__btn"
					>
						Выбрать водителя из резерва
					</button>
				</router-link>

				<router-link
					v-if="btnMore"
					:to="{ name: 'active-leg-info', params: { legId: legData.legId }}"
					class="head__link"
				>
					<button
						class="head__btn"
					>
						Подробнее
						<el-icon>
							<Arrow-right-icon />
						</el-icon>
					</button>
				</router-link>
			</div>
		</header>

		<el-collapse-transition>
			<div
				v-show="isCollapsed"
			>
				<div class="body">
					<div
						class="status"
					>
						<div class="status__left">
							<div class="status__group">
								<div class="body__label">
									Статус
								</div>
								<div class="body__content status_red">
									Превышение скорости погрузки
								</div>
							</div>
							<div class="status__group">
								<div class="body__label">
									Скорость погрузки
								</div>
								<div class="body__content status__speed">
									<div class="status__current status_red">
										Факт <span>4</span> авто/час
									</div>
									<div class="status__plan">
										План <span>2</span> авто час
									</div>
								</div>
							</div>
						</div>
						<div class="status__right">
							<div class="status__group">
								<div class="body__label">
									Механизатор
								</div>
								<div class="body__content">
									Иванов Иван Иванович
								</div>
							</div>
							<div class="status__group">
								<div class="body__label">
									Погрузчик
								</div>
								<div class="body__content">
									Н1ОГ32Ф
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="currentDrivers < plannedDrivers"
						class="status factory"
					>
						<div class="status__group">
							<div class="body__label">
								Статус завода
							</div>
							<div class="body__content status_red">
								Избыток машин на заводе
							</div>
						</div>
						<div class="status__group">
							<div class="body__label">
								Количество машин
							</div>
							<div class="body__content status_normal status_red">
								{{ currentDrivers }}
							</div>
						</div>
					</div>

					<div class="body__info">
						<div class="body__elem">
							<div class="body__branch">
								<div class="body__label">
									Филиал
								</div>
								<div class="body__content">
									{{ legData.field.supply.name }}
								</div>
							</div>
						</div>
						<div class="body__elem">
							<div class="body__branch">
								<div class="body__label">
									Пункт приемки
								</div>
								<div class="body__content">
									{{ legData.factory.name }}
								</div>
							</div>
						</div>
					</div>
					<div
						class="body__volume"
						:class="{'body__volume_error': legData.actualAmount < (legData.plannedAmount / 2)}"
					>
						<div class="body__elem">
							<div class="body__label">
								В процессе
							</div>
							<div class="body__content">
								{{ legData.processAmount }} т
							</div>
						</div>
						<div class="body__elem">
							<div class="body__label">
								Фактический объем
							</div>
							<div class="body__content body__content_red">
								{{ legData.actualAmount }} т
							</div>
						</div>
						<div class="body__elem">
							<div class="body__label">
								Плановый объем
							</div>
							<div class="body__content">
								{{ legData.plannedAmount }} т
							</div>
						</div>
					</div>
				</div>

				<div class="field-name">
					<div class="field-name__current">
						46ФАТ222-1
					</div>
					<el-icon>
						<right-icon />
					</el-icon>
					<div class="field-name__next">
						46ФАТ222-2
					</div>
				</div>

				<leg-statuses
					:statuses-data="legData.driverStatus"
					:statuses="legsStatuses"
				/>
			</div>
		</el-collapse-transition>
	</div>
</template>

<script>
import LegStatuses from './LegStatuses'

import { 
	Right as RightIcon, 
	ArrowUpBold as ArrowUpIcon, 
	ArrowRightBold as ArrowRightIcon 
} from '@element-plus/icons-vue'

import { ref, toRefs, computed } from 'vue'

const legsStatuses = {
	get: 'Рейс назначен',
	load: 'Погрузка',
	factory: 'Движение к пункту приемки',
	begin_unload: 'Ожидание разгрузки',
	unload: 'Разгрузка на пункте приемки',
	field: 'Движение к полю'
}

export default {
	components: {
		RightIcon, 
		ArrowUpIcon, 
		LegStatuses, 
		ArrowRightIcon
	},
	props: {
		legData: {
			type: [Object, null],
			required: true,
		},
		btnReserve: {
			type: Boolean,
			default: () => true
		},
		btnMore: {
			type: Boolean,
			default: () => true
		},
		isCollapsable: {
			type: Boolean,
			default: () => true
		}
	},
	setup(props) {
		const {
			legData
		} = toRefs(props)

		let isCollapsed = ref(true)

		const collapse = () => {
			isCollapsed.value = !isCollapsed.value
		}

		const plannedDrivers = computed(() => {
			return getRezultDrivers(legData.value.driverStatus, 'plannedNumberDrivers')
		})

		const currentDrivers = computed(() => {
			return getRezultDrivers(legData.value.driverStatus, 'currentNumberDrivers')
		})

		const getRezultDrivers = (statuses, key) => {
			const initial = 0

			return Object.keys(legsStatuses).reduce((acc, status) => {
				return acc+= statuses[status][key]
			}, initial)
		}
        
		return {
			collapse,
			isCollapsed,
			legsStatuses,
			plannedDrivers,
			currentDrivers
		}
	}
}
</script>

<style scoped lang="scss">
.active-leg {
    border: 1px solid theme-color(gray-300);
    border-radius: 20px;
    padding: 20px 20px 0;
	
	&:not(:last-child) {
		margin-bottom: theme-space(m);
	}

    .head {
        padding-bottom: theme-space(xs);
        display: flex;

        &__left {
            display: flex;
            align-items: center;

            > div {
                &:not(:first-child) {
                    margin-left: 20px;
                }
            }
        }

        &__arrow {
            cursor: pointer;
            font-size: 17px;
            color: theme-color(gray-700);
            margin-left: 10px;
            transition: all 160ms ease;

            &_collapse {
                transform: rotate(180deg);
            }
        }

        &__label {
            font-weight: 500;
            font-size: 24px;
            line-height: 24px;
            color: #4D4D4D;
        }

        &__circle {
            width: 6px;
            height: 6px;
            background: theme-color(gray-500);
            opacity: 0.3;
            border-radius: 50%;
        }

        &__number-drivers {
            display: flex;
        }

        &__info {
            font-weight: 500;
            font-size: 16px;
            line-height: 16px;
            color: theme-color(gray-500)
        }

        &__drivers-group {
            margin-left: 5px;
        }

        &__current-drivers {
            &_error {
                color: theme-color(status-error);
            }
        }

        &__right {
            display: flex;
            align-items: center;
            margin-left: auto;
        }

        &__btn {
            border: 1px solid theme-color(gray-300);
            border-radius: 8px;
            height: 40px;
            padding: theme-space(3xs) theme-space(xs) theme-space(3xs) 10px;
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 24px;
            color: theme-color(gray-500);
            cursor: pointer;
            background: #FFFFFF;

            &:hover {
                background: theme-color(gray-100);
            }
        }

        &__link{
            margin-left: theme-space(xs);
        }

        .el-icon {
            margin-left: theme-space(xs);
            color: theme-color(gray-500);
        }

        &__link {
            text-decoration: none;
        }

        &_bold {
            font-weight: 700;
            font-size: 26px;
            line-height: 16px;
        }
    }

    .body {
        padding: theme-space(3xs) 0;
        border-bottom: 1px solid theme-color(gray-300);
        border-top: 1px solid theme-color(gray-300);
        display: flex;

        &__elem {
            margin-top: 10px;

            &:last-child {
                margin-bottom: 10px;
            }
        }

        &__label {
            font-size: 12px;
            line-height: 16px;
            color: theme-color(gray-500);
        }

        &__content {
            margin-top: 5px;
            font-size: 14px;
            line-height: 20px;
            color: #4D4D4D;
            min-width: 47px;
        }

        &__volume {
            margin-left: auto;
            padding: theme-space(xs);
            border-radius: 16px;

            .body__elem {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 0px;

                &:not(:first-child) {
                    margin-top: 13px;
                }
            }

            .body__content {
                margin-left: theme-space(xs);
                font-weight: 600;
                font-size: 18px;
                color: theme-color(gray-500);
                text-align: right;

                &_red {
                    color: theme-color(status-error);
                }
            }

            &_error {
                background: theme-color(status-error-light);
            }
        }

        .status {
            padding: theme-space(xs) 22px;
            margin-right: theme-space(xs);
            background: theme-color(status-error-light);
            border-radius: 16px;
            display: flex;

            &__left {
                padding: theme-space(3xs) 23px theme-space(3xs) 0px;
                border-right: 1px solid theme-color(gray-300);
            }

            &__right {
                margin-left: 25px;
            }

            &__group {
                &:not(:first-child) {
                    margin-top: 18px;
                }
            }

            &_red {
                color: theme-color(status-error);
            }

            &__speed {
                display: flex;
            }

            &__current {
                margin-right: theme-space(xs);
            }
        }
    }

	.factory {
		flex-direction: column;
	}

    .field-name{
        margin: theme-space(s) 0 40px 0;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;

        &__next {
            color: theme-color(gray-700);
            opacity: 0.5;
        }

        .el-icon {
            margin: 0 29px;
            color: theme-color(gray-700);
        }
    }
}
</style>
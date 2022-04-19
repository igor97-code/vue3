<template>
	<div class="leg-statuses">
		<div
			v-for="(status, key) in statuses"
			:key="key"
			class="leg-statuses__part"
			:class="{
				'leg-statuses__part_error': statusesData[key].currentNumberDrivers < statusesData[key].plannedNumberDrivers
			}"
		>
			<div class="leg-statuses__info">
				<car-icon class="leg-statuses__car-icon" />

				<div class="leg-statuses__numbers">
					<span class="leg-statuses__number leg-statuses__number_error">
						{{ statusesData[key].currentNumberDrivers }}
					</span>

					из

					<span class="leg-statuses__number">
						{{ statusesData[key].plannedNumberDrivers }}
					</span>
				</div>
			</div>
			<div class="leg-statuses__group">
				<popper placement="bottom">
					<div class="leg-statuses__circle" />

					<template
						v-if="statusesData[key].currentNumberDrivers < statusesData[key].plannedNumberDrivers"
						#content="{ close }"
					>
						<div>
							<div class="leg-popper">
								<div class="leg-popper__head">
									<div class="leg-popper__title">
										Информация о водителях
									</div>

									<el-icon>
										<close-icon @click="close" />
									</el-icon>
								</div>

								<div class="status">
									<span class="status__title">
										Опоздавшие:
									</span>

									<span class="status__num">
										1
									</span>
								</div>

								<div class="card">
									<div class="card__head">
										<div class="card__num-car">
											Н1ОГ32Ф
										</div>

										<div class="card__factory">
											ИП Сокольникова М.Л.
										</div>
									</div>

									<div class="card__driver-name">
										Иванов Иван Иванович
									</div>

									<div class="status-problem">
										<div class="status-problem__item">
											<div class="status-problem__title">
												Задерживается на статусе “Ожидание на поле”
											</div>

											<div class="status-problem__time">
												~45 мин
											</div>
										</div>

										<div class="status-problem__item">
											<div class="status-problem__title">
												Опоздание на текущий статус
											</div>

											<div class="status-problem__time">
												~15 мин
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>
				</popper>
			</div>

			<div class="leg-statuses__title">
				{{ status }}
			</div>
		</div>
	</div>
</template>

<script>
import CarIcon from '@/assets/icons/car-icon.svg?inline'

import Popper from 'vue3-popper'

import { Close as CloseIcon } from '@element-plus/icons-vue'

export default {
	components: {
		CarIcon, 
		Popper, 
		CloseIcon
	},
	props: {
		statusesData: {
			type: Object,
			required: true,
		},
		statuses: {
			type: Object,
			required: true,
		}
	}
}
</script>

<style scoped lang="scss">

.leg-statuses {
    margin-top: 70px;
    display: flex;
    height: 100px;

    .leg-popper {
        background: #FFFFFF;
        border: 1px solid theme-color(gray-300);
        border-radius: 8px;
        padding: theme-space(s);
        width: 464px;

        &__head {
            display: flex;
            justify-content: space-between;
        }

        &__title {
            font-weight: 500;
            font-size: 16px;
            line-height: 16px;
            color: theme-color(gray-700);
        }

        .el-icon {
            cursor: pointer;
            color: theme-color(gray-500);
            font-size: 22px;

            &:hover {
                color: theme-color(gray-700);
            }
        }

        .status {
            margin-top: theme-space(3xs);
            font-size: 12px;
            line-height: 16px;
            color: theme-color(gray-700);

            &__num {
                color: theme-color(status-error);
            }
        }

        .card {
            padding: 16px;
            background: theme-color(gray-100);
            border-radius: 8px;
            margin-top: theme-space(xs);
            line-height: 16px;
            &__head {
                display: flex;
                justify-content: space-between;
            }

            &__num-car {
                font-size: 16px;
                color: theme-color(gray-700);
            }

            &__factory {
                font-size: 12px;
                color: theme-color(primary);
            }

            &__driver-name {
                font-size: 14px;
                color: theme-color(gray-700);
                margin-top: theme-space(s);
            }

            .status-problem {
                margin-top: theme-space(3xs);

                &__item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    line-height: 16px;

                    &:not(:first-child) {
                        margin-top: theme-space(3xs);
                    }
                }

                &__title {
                    color: theme-color(gray-500);
                }

                &__time {
                    color: theme-color(status-error);
                }
            }
        }
    }

    &__part {
        width: 20%;
        position: relative;
        &:not(:first-child) {
            .leg-statuses__title {
                transform: translate(-50%, 0);
                text-align: center;
                left: 10px;
            }

            .leg-statuses__info {
                transform: translate(-50%, 0);
            }
        }

        &:last-child {
            .leg-statuses__info {
                transform: translate(-90%, 0);
                justify-content: end;
                width: 135px;
            }

            .leg-statuses__title {
                transform: translate(-83%, 0);
                width: 160px;
            }

            width: auto;
        }

        &_error {
            .leg-statuses__circle {
                border: 4px solid theme-color(status-error);
                cursor: pointer;
            }

            .leg-statuses__number_error {
                color: theme-color(status-error);
            }
        }

        &:not(:last-child) {

            .leg-statuses__group {
                &::after {
                    content: '';
                    width: 100%;
                    border: 2px solid theme-color(gray-100);
                    margin: 0 8px;
                    position: relative;
                }
            }
        }
    }

    &__circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 4px solid theme-color(gray-500);
        position: relative;
        flex-shrink: 0;

        &_error {
            border: 4px solid theme-color(gray-500);
        }
    }

    &__title {
        position: absolute;
        max-width: 175px;
        text-align: left;
        margin-top: 10px;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        color: theme-color(gray-500);
    }

    &__info {
        position: absolute;
        bottom: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    &__car-icon {
        color: theme-color(gray-500);
    }

    &__numbers {
        margin-left: theme-space(3xs);
        color: theme-color(gray-500);
        font-weight: 400;
        font-size: 14px;
        line-height: 12px;
    }

    &__number {
        font-weight: 700;
        font-size: 20px;
        line-height: 16px;
    }

    &__group {
        display: flex;
        align-items: center;
    }
}
</style>

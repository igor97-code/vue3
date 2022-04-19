<template>
	<div class="custom-table__wrapper">
		<div class="custom-table__header-wrapper">
			<table class="custom-table">
				<thead class="custom-table__head">
					<tr class="custom-table__row">
						<th
							v-for="item in columns"
							:key="item[columnKey]"
							class="custom-table__th custom-table__td"
							:class="columnClass(item.key)"
							:style="{
								'max-width': item['max-width'],
								width: item.width
							}"
						>
							<slot
								:name="`header:${item.key}`"
								:header="item"
							>
								{{ item.label }}
							</slot>
						</th>
					</tr>
				</thead>

				<tbody v-if="isEmpty(data)">
					<tr>
						<td
							class="custom-table__empty-text weight_medium" 
							:colspan="columns.length"
						>
							Нет данных 
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<el-scrollbar>
			<template v-if="!isEmpty(data)">
				<table
					v-if="Array.isArray(data)"
					class="custom-table"
				>
					<tbody
						class="custom-table__body"
					>
						<tr
							v-for="(item, index) in data"
							:key="item[columnKey]"
							class="custom-table__row custom-table__row_hoverable"
							:class="rowClass(item, index)"
						>
							<td
								v-for="column in columns"
								:key="column.key"
								class="custom-table__td"
								:class="columnClass(column.key)"
								:style="{
									'max-width': column['max-width'],
									width: column.width
								}"
							>
								<slot
									:name="`data:${column.key}`"
									:item="item"
									:row-index="index"
								>
									{{ item[column.key] }}
								</slot>
							</td>
						</tr>
					</tbody>
				</table>
	
				<template v-else>
					<table 
						v-if="data.total"
						class="custom-table"
					>
						<tbody
							class="custom-table__body"
						>
							<tr
								class="custom-table__row weight_bold font-size_xl"
							>
								<td
									v-for="column in columns"
									:key="column.key"
									class="custom-table__td"
									:class="columnClass(column.key)"
									:style="{
										'max-width': column['max-width'],
										width: column.width
									}"
								>
									<slot
										:name="`data:total-${column.key}`"
										:item="data.total"
									>
										{{ data.total[column.key] }}
									</slot>
								</td>
							</tr>
						</tbody>
					</table>
	
					<template 
						v-for="group in data.groups"
						:key="group.total.status"
					>
						<table 
							v-if="group.total"
							class="custom-table group-head"
						>
							<tbody
								class="custom-table__body"
							>
								<tr
									class="custom-table__row weight_bold font-size_xl"
								>
									<td
										v-for="(column, index) in columns"
										:key="index"
										class="custom-table__td"
										:class="columnClass(column.key)"
										:style="{
											'max-width': column['max-width'],
											width: column.width
										}"
									>
										<slot
											:name="`data:group-total-${column.key}`"
											:group="group"
										>
											{{ group.total[column.key] }}
										</slot>
									</td>
								</tr>
							</tbody>
						</table>
	
						<el-collapse-transition>
							<div v-if="!group.collapsed.value">
								<table 
									class="custom-table"
								>
									<tbody
										class="custom-table__body"
									>
										<tr
											v-for="(item, index) in group.rows"
											:key="item[columnKey]"
											class="custom-table__row custom-table__row_hoverable"
											:class="rowClass(item, group.rows[index + 1], index)"
										>
											<td
												v-for="column in columns"
												:key="column.key"
												class="custom-table__td"
												:class="columnClass(column.key)"
												:style="{
													'max-width': column['max-width'],
													width: column.width
												}"
											>
												<slot
													:name="`data:${column.key}`"
													:item="item"
													:row-index="index"
												>
													{{ item[column.key] }}
												</slot>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-collapse-transition>
					</template>
				</template>
			</template>
		</el-scrollbar>
	</div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'

export default {
	props: {
		columns: {
			type: Array,
			required: true
		},
		data: {
			type: [Array, Object],
			required: true
		},
		rowClass: {
			type: Function,
			default: () => ({})
		},
		columnClass: {
			type: Function,
			default: () => ({})
		},
		columnKey: {
			type: String,
			default: 'id'
		}
	},
	setup() {
		return {
			isEmpty
		}
	}
}
</script>

<style lang="scss" scoped>
.custom-table {
	color: theme-color(gray-700);
	width: 100%;
	vertical-align: middle;
	text-align: left;
	border-collapse: collapse;
	table-layout: fixed;

	&__header-wrapper {
		margin-bottom: theme-space(2xs);
	}

	&__th {
		color: theme-color(gray-500);
		font-size: inherit;
		line-height: inherit;
		font-weight: inherit;
		padding: theme-space(xs) 9px;
		background: theme-color(gray-100);

		&:first-child {
			border-top-left-radius: 16px;
			border-bottom-left-radius: 16px;
			padding-left: 18px;
		}

		&:last-child {
			border-top-right-radius: 16px;
			border-bottom-right-radius: 16px;
		}
	}

	&__td {
		font-size: inherit;
		line-height: inherit;
		font-weight: inherit;
		padding: theme-space(xs) 9px;
		transition: background-color 160ms ease;

		&:first-child {
			border-top-left-radius: 16px;
			border-bottom-left-radius: 16px;
			padding-left: 18px;
		}

		&:last-child {
			border-top-right-radius: 16px;
			border-bottom-right-radius: 16px;
		}
	}

	&__body {

		.custom-table__row_hoverable {
			&:hover {
				td {
					background: theme-color(gray-100);
				}
			}
		}
	}

	& &__row {

		&_selected {
			td.custom-table__td {
				background: theme-color(primary-light);
			}

			+ .custom-table__row_selected {

				td {
					&:first-child {
						border-top-left-radius: 0;
					}

					&:last-child {
						border-top-right-radius: 0;
					}
				}
			}
		}

		&_next-row-selected {
			td {
				&:first-child {
					border-bottom-left-radius: 0;
				}

				&:last-child {
					border-bottom-right-radius: 0;
				}
			}
		}

		&_error {
			td.custom-table__td {
				background: theme-color(status-error-light);
			}

			+ .custom-table__row_error {

				td {
					&:first-child {
						border-top-left-radius: 0;
					}

					&:last-child {
						border-top-right-radius: 0;
					}
				}
			}
		}

		&_next-row-error {
			td {
				&:first-child {
					border-bottom-left-radius: 0;
				}

				&:last-child {
					border-bottom-right-radius: 0;
				}
			}
		}
	}

	&__empty-text {
		text-align: center;
		color: theme-color(gray-500);
		height: 200px;
		font-size: 16px;
		line-height: 24px;
	}
}

.group-head {
	margin-top: theme-space(2xs);
	border-top: 0.5px solid theme-color(gray-300);
}

.el-scrollbar {
	border-radius: 16px;
}
</style>
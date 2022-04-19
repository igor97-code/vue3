<template>
	<default-page-container v-loading="isLoading">
		<div class="content">
			<button
				class="content__authorization"
				@click="$router.push({ name: 'login' })"
			>
				Авторизоваться
			</button>
			<div class="content__title">
				Создание пароля
			</div>
			<div class="content__text">
				Придумайте пароль для своей учетной записи user@prodimex.ru
			</div>
			<div class="validate-info">
				<div
					v-for="(item, key) in validate"
					:key="key"
					class="validate-info__item"
				>
					<div
						class="validate-info__icon"
						:class="{'validate-info__icon_valid': validate[key].valid}"
					>
						<el-icon>
							<select-icon />
						</el-icon>
					</div>
					<div class="validate-info__text">
						{{ key }}
					</div>
				</div>
			</div>
			<div class="content__form">
				<el-form
					ref="ruleFormRef"
					:model="formData"
					status-icon
					:rules="rules"
					@keyup.enter="submitForm"
				>
					<el-form-item
						prop="password"
					>
						<el-input
							v-model="formData.password"
							type="password"
							autocomplete="off"
							placeholder="пароль"
							clearable
						/>
					</el-form-item>
					<el-form-item
						prop="confirmPassword"
					>
						<el-input
							v-model="formData.confirmPassword"
							type="password"
							autocomplete="off"
							placeholder="повторите пароль"
							clearable
						/>
					</el-form-item>
					<el-collapse-transition>
						<div
							v-if="isInvalidForm.text"
							class="content__error"
						>
							<div
								class="content__circle"
							/>

							{{ isInvalidForm.text }}
						</div>
					</el-collapse-transition>
					<el-form-item>
						<el-button
							type="primary"
							:disabled="!formData.confirmPassword || !formData.password || isInvalidForm.value"
							:loading="isLoading"
							@click="submitForm(ruleFormRef)"
						>
							Сохранить и авторизоваться
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</default-page-container>
</template>

<script>
import DefaultPageContainer from '@/components/DefaultPageContainer'
import {reactive, ref} from 'vue'
import { Select as selectIcon } from '@element-plus/icons-vue'
import { authentication } from '@/api/'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

export default {
	components: {DefaultPageContainer, selectIcon},
	setup() {
		const route = useRoute()
		const router = useRouter()
		const ruleFormRef = ref(null)
		const validate = reactive({
			'10 символов': {
				valid: false,
				reg: /[^]{10,}/
			},
			'A-Z': {
				valid: false,
				reg: /[A-Z]/
			},
			'a-z': {
				valid: false,
				reg: /[a-z]/
			},
			'1 цифра': {
				valid: false,
				reg: /\d/,
			},
			'1 спец. символ': {
				valid: false,
				reg: /[!@#$%^&*]/i
			},
		})

		const formData = reactive({
			password: '',
			confirmPassword: '',
		})

		let isInvalidForm = reactive({
			value: true,
			text: ''
		})

		const isLoading = ref(false)
        
		const validatePass = (rule, value, callback) => {
			let validForm = true
			//TODO: Вернуть проверку пароля когда будут актуальные учетки
			for(const valid in validate) {
				if(validate[valid].reg) {
					if(validate[valid].reg.test(value)) {
						validate[valid].valid = true
					}
					else {
						validate[valid].valid = false
						validForm = false
					}
				}
			}

			if(!validForm || value === ''){
				callback(new Error(''))
				isInvalidForm.value = true 
				return
			}
			isInvalidForm.value = false
			callback()
		}

		const validatePass2 = (rule, value, callback) => {
			if (value === '' || value !== formData.password) {
				isInvalidForm.value = true
				isInvalidForm.text = 'Пароли должны совпадать'
				callback(new Error(''))
				return
			}

			isInvalidForm.value = false
			isInvalidForm.text = ''
			callback()
		}

		const rules = reactive({
			password: [{ validator: validatePass, trigger: 'change' }],
			confirmPassword: [{ validator: validatePass2, trigger: 'change' }],
		})
        
		const submitForm = () => {
			ruleFormRef.value.validate(async (valid) => {
				if (!valid) {
					return
				}
				try {
					isLoading.value = true
					await authentication.resetPassword({key: route.query.key, newPassword: formData.password})
					router.push({name: 'login'})
				}
				catch(error) {
					console.log(error)
				}
				finally {
					isLoading.value = false
				}
			})
		}
        
		return {
			validate,
			ruleFormRef,
			validatePass,
			validatePass2,
			formData,
			submitForm,
			rules,
			isInvalidForm,
			route,
			router,
			isLoading
		}
	}
}
</script>

<style scoped lang="scss">
@import "~@/styles/loginPages.scss";

.content {
    .validate-info {
        display: flex;
        margin-top: 35px;

        &__item {
            display: flex;
            align-items: center;

            &:not(:first-child) {
                margin-left: theme-space(xs);
            }
        }

        &__text {
            margin-left: 6px;
            font-size: 14px;
            line-height: 20px;
            color: theme-color(gray-500);
        }

        &__icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid theme-color(gray-500);
            font-size: 8px;
            border-radius: 50%;

            &_valid {
                color: #FFFFFF;
                border: initial;
                background: #80C683;
            }
        }
    }
}
</style>
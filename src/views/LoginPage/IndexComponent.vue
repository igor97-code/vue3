<template>
	<div
		v-loading="isLoading"
		class="authorization"
	>
		<div>
			<div
				class="authorization__form"
			>
				<img
					src="@/assets/images/logo.png"
					alt="logo"
					class="authorization__logo"
				>

				<div class="authorization__title">
					Вход в учетную запись
				</div>

				<p class="authorization__text">
					Чтобы авторизоваться в учетной записи, введите свою рабочую электронную почту и пароль
				</p>

				<el-form
					ref="formRef"
					:model="formData"
					status-icon
					:rules="rules"
					class="demo-ruleForm"
					autocomplete="off"
					@validate="validate"
					@keyup.enter="submitForm"
				>
					<el-form-item
						prop="username"
						:error="errorForm.username ? '' : null"
					>
						<el-input
							v-model="formData.username"
							type="email"
							placeholder="электронная почта"
							autocomplete="off"
						/>
					</el-form-item>

					<el-form-item
						prop="password"
						:error="errorForm.password ? '' : null"
					>
						<el-input
							v-model="formData.password"
							type="password"
							placeholder="пароль"
							:show-password="true"
							clearable
							autocomplete="new-password"
						/>
					</el-form-item>

					<el-collapse-transition>
						<div
							v-if="errorForm.text"
							class="authorization__error"
						>
							<div
								class="authorization__circle"
							/>
	
							{{ errorForm.text }}
						</div>
					</el-collapse-transition>

					<div class="authorization__checkbox">
						<el-checkbox
							v-model="formData.checkbox"
							label="Оставаться в системе"
						/>
					</div>

					<el-form-item>
						<el-button
							type="primary"
							:disabled="isInvalidForm"
							:loading="isLoading"
							@click="submitForm"
						>
							Войти
						</el-button>
					</el-form-item>
				</el-form>
				<button
					class="authorization__forgot-password"
					@click="$router.push({name: 'recovery-password'})"
				>
					Забыли пароль?
				</button>
			</div>
		</div>
	</div>
</template>
<script>
import API from '@/api/services/authentication'

import { reactive, ref,  computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
	setup() {
		const formRef = ref(null)

		const formData = reactive({
			password: '',
			username: '',
			checkbox: true,
		})

		const errorForm = reactive({
			username: true,
			password: true,
			text: ''
		})
        
		const isLoading = ref(false)
        
		const router = useRouter()
		const isInvalidForm = computed(() => {
			return errorForm.username || errorForm.password
		})

		const validatePass = (_, value, callback) => {
			if (value === '') {
				callback(new Error(''))
				errorForm.password = true
			} else {
				errorForm.password = false
				callback()
			}
		}

		const validateEmail = (_, value, callback) => {
			//TODO: Вернуть проверку на имейл когда будут актуальные учетки
			// const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
			// if (!reg.test(value)) {
			if (!value) {
				callback(new Error(''))
				errorForm.username = true
			} else {
				errorForm.username = false
				callback()
			}
		}
        
		const validate = () => {
			if(errorForm.username) {
				errorForm.text = 'Адрес электронной почты должен содержать @ и имя домена (.ru, .com и т.п.)'
			} else {
				errorForm.text = ''
			}
		}

		const rules = reactive({
			password: [{ validator: validatePass, trigger: 'change' }],
			username: [{ validator: validateEmail, trigger: 'change' }],
		})

		const submitForm = () => {
			formRef.value.validate(async (valid) => {
				if (!valid) {
					return
				}
				try {
					isLoading.value = true

					const { data } = await API.login({username: formData.username, password: formData.password } )

					localStorage.setItem('accessToken', data.resp.accessToken)
					localStorage.setItem('refreshToken', data.resp.refreshToken)

					router.push({ name: 'home' })
				}
				catch(error) {
					console.error(error)
					
					errorForm.text = 'Пароль или адрес электронной почты введен неверно. Пожалуйста, попробуйте еще раз'

					isLoading.value = false
				}
			})
		}

		return {
			rules,
			submitForm,
			formRef,
			formData,
			errorForm,
			validate,
			isInvalidForm,
			isLoading
		}
	}
}

</script>

<style scoped lang="scss">
@import "~@/styles/loginPages.scss";
.authorization {
    display: flex;
    justify-content: center;
    margin-top: 145px;

    &__form {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: auto;
        margin: 0;
    }

    &__text {
        max-width: 363px;
        margin-bottom: theme-space(m);
    }

    &__checkbox {
        display: flex;
        justify-content: flex-start;
        margin: theme-space(2xs) 0 theme-space(xs) 0;
		padding: 0 12px;
    }

    &__forgot-password {
        margin-top: 6px;
        border: initial;
        background: theme-color(default-white);
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        color: theme-color(gray-500);
        cursor: pointer;

        &:hover {
            color: theme-color(gray-700);
        }
    }
}

::v-deep(.el-form) {
    width: 320px;
	
    .el {
		&-form-item {

			&:not(.is-error) .el-input__inner {
				&:hover,
				&:focus {
					box-shadow: none;
				}
			}
		}

        &-input {
            &__inner {
                font-weight: 400;
                font-size: 14px;
                line-height: 14px;
                color: theme-color(gray-500);
                padding: theme-space(xs);
                background: theme-color(gray-100);
                height: 48px;
            }

			&__suffix {
                display: none;
            }

        }

        &-checkbox {
            &__inner {
                width: 20px;
                height: 20px;
                border-radius: 5px;

                &::after {
                    left: 7px;
                    top: 3px;
                }
            }

            &__label {
                font-weight: 500;
                font-size: 14px;
                line-height: 24px;
                --el-checkbox-checked-text-color: theme-color(gray-500);
                padding-left: theme-space(3xs);
            }
        }

        &-button {
            font-weight: 500;
            font-size: 14px;
            line-height: 24px;
            width:320px;
            height: 40px;

            &:hover, &:focus {
                background-color: theme-color(primary);
                border-color: theme-color(primary);
            }

            &.is-disabled:hover, &:disabled {
                opacity: 0.5;
                background-color: theme-color(primary);
            }
        }
    }
}
</style>
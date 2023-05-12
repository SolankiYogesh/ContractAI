const EndPoints = {
  register: '/auth_api/v1/register/',
  login: '/auth_api/v1/login/',
  refresh: '/auth_api/v1/token_refresh/',
  verifyOTP: '/auth_api/v1/verify_otp/',
  forgotPass: '/auth_api/v1/forgot_password/',
  resetpassword: '/auth_api/v1/reset_password/',
  resendOTP: '/auth_api/v1/resend_otp/',
  changePassword: '/auth_api/v1/change_password/',
  deleteAccount: '/account_api/v1/disable_account/',
  reportIssue: '/account_api/v1/report/',
  editProfile: '/account_api/v1/profile/',
  getContacts: '/account_api/v1/contacts/',
  getEmailTemplates: '/account_api/v1/email/',
  sendPrompt: '/reeva_api/v1/sendPrompt',
  getOffers: '/account_api/v1/getcontracts',
  getChat: '/account_api/v1/getchat/ID',
  googleLogin: '/social_auth/v1/google/'
}

export default EndPoints

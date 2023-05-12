import {createSlice} from '@reduxjs/toolkit'

import Utility from '../../Theme/Utility'

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = {...(state.userData || {}), ...action.payload}
    },
    setToken: (state, action) => {
      const cloneUser = Utility.deepClone(state.userData)
      cloneUser.token = action.payload?.token
      cloneUser.refresh_token = action.payload?.refresh_token
      state.userData = cloneUser
    },
    logOut: (state) => {
      state.userData = null
    }
  }
})
export const {logOut, setUserData, setToken} = UserSlice.actions
export default UserSlice.reducer

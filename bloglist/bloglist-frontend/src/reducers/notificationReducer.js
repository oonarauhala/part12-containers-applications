import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(state, action) { // eslint-disable-line no-unused-vars
      return action.payload
    },
    resetNotification(state, action) { // eslint-disable-line no-unused-vars
      return null
    },
  },
})

export const { createNotification, resetNotification } =
  notificationSlice.actions
export default notificationSlice.reducer

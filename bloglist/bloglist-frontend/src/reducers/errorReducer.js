import { createSlice } from '@reduxjs/toolkit'

const errorSlice = createSlice({
  name: 'error',
  initialState: null,
  reducers: {
    createError(state, action) { // eslint-disable-line no-unused-vars
      return action.payload
    },
    resetError(state, action) { // eslint-disable-line no-unused-vars
      return null
    },
  },
})

export const { createError, resetError } = errorSlice.actions
export default errorSlice.reducer

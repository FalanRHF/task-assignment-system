import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = { loggedin: false, type: "client" }

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    setUser: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload
      }
    },

    resetUser: (state) => {
      state.value = initialStateValue
    }
  }
})

export const { setUser, resetUser } = userSlice.actions

export default userSlice.reducer

// brb
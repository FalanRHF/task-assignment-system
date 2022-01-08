import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = "black"

export const themeSlice = createSlice({
  name: "theme",
  initialState: { value: initialStateValue },
  reducers: {
    changeTextColour: (state, action) => {
      state.value = action.payload
    },
  }
})

export const { changeTextColour } = themeSlice.actions

export default themeSlice.reducer

// brb
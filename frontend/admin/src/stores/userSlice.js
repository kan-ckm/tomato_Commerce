import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload
            console.log('userDetails', action.payload)
        },
        logoutUser: (state) => {
            state.user = null
            console.log('User logged out');
        }
    },
})

export const { setUserDetails, logoutUser } = userSlice.actions

export default userSlice.reducer

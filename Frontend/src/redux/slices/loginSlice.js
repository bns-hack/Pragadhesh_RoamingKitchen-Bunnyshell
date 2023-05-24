import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isAuthenticationFailed: false
}

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
        updateAuthenticationStatus: (state,action) => {
            state.isAuthenticationFailed = action.payload
        }
    }
})

export const {updateAuthenticationStatus} = loginSlice.actions

export default loginSlice.reducer
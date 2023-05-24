import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    activeCategory: "inventory",
    storelatitude: 37.7749,
    storelongitude: -122.4194,
    order: null
}

const managerSlice = createSlice({
    name: 'managerSlice',
    initialState,
    reducers: {
        updateActiveCategory: (state,action) => {
            state.activeCategory = action.payload
        },
        updateLocation: (state,action) => {
            state.storelatitude = action.payload.latitude
            state.storelongitude = action.payload.longitude
        },
        updateOrder: (state,action) => {
            state.order = action.payload.order
        }

    }
})

export const {updateActiveCategory,updateLocation,updateOrder} = managerSlice.actions

export default managerSlice.reducer
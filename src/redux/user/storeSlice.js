// src/redux/slices/itemSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    item: 'shirt'
};

const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        updateItem: (state, action) => {
            state.item = action.payload;
        },
        
    }
});

export const { updateItem } = itemSlice.actions;

export default itemSlice.reducer;

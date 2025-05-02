import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
};

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            const product = action.payload;
            const itemId = product._id;

            if (state.cartItems[itemId]) {
                console.log("Item already in cart");
            } else {
                state.cartItems = ({ ...state.cartItems, [itemId]: product, });
                console.log("Item added to cart");
            }
        },

        removeFromBasket: (state, action) => {
            const itemId = action.payload;
            if (state.cartItems[itemId]) {
                const { [itemId]: removedItem, ...remainingItems } = state.cartItems;
                state.cartItems = remainingItems;
                console.log(`Item with ID: ${itemId} removed from cart`);
            } else {
                console.log(`Item with ID: ${itemId} not found in the cart`);
            }
        },
        clearBasket: (state) => {
            state.cartItems = {};
            console.log("Cart has been cleared");
        }
    }
});

export const { addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;

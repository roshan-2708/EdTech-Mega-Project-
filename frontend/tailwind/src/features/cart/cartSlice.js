import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    totalItems: localStorage.getItem("totalItems")
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0,
    totalPrice: localStorage.getItem("totalPrice")
        ? JSON.parse(localStorage.getItem("totalPrice"))
        : 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // ==============================
        // ADD TO CART
        // ==============================
        addToCart(state, action) {
            const course = action.payload
            const index = state.cart.findIndex(
                (item) => item._id === course._id
            )

            if (index >= 0) {
                toast.error("Course already in cart")
                return
            }

            state.cart.push(course)
            state.totalItems += 1
            state.totalPrice += course.price

            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
            localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice))

            toast.success("Course added to cart")
        },

        // ==============================
        // REMOVE FROM CART
        // ==============================
        removeFromCart(state, action) {
            const courseId = action.payload
            const index = state.cart.findIndex(
                (item) => item._id === courseId
            )

            if (index === -1) return

            state.totalPrice -= state.cart[index].price
            state.cart.splice(index, 1)
            state.totalItems -= 1

            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
            localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice))

            toast.success("Course removed from cart")
        },

        // ==============================
        // RESET CART
        // ==============================
        resetCart(state) {
            state.cart = []
            state.totalItems = 0
            state.totalPrice = 0

            localStorage.removeItem("cart")
            localStorage.removeItem("totalItems")
            localStorage.removeItem("totalPrice")
        },
    },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions
export default cartSlice.reducer

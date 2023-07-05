import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state,action) =>{
        const course =action.payload;
        const index = state.cart.findIndex((item)=> item._id===course._id);


        // if Course is already present to cart
        if(index >=0){
            toast.error("Course already in cart")
            return
        }

        // if course is notin the cart add to cart
        state.cart.push(course);
        // update total quantity and price
        state.totalItems++;
        state.total+=course.price;

        // upadet to localStorage
        localStorage.setItem("cart",JSON.stringify(state.cart))
        localStorage.setItem("total",JSON.stringify(state.total))
        localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

        toast.success("Course added to cart");

    },
    removeFromCart: (state,action) =>{
        const course =action.payload;
        const index = state.cart.findIndex((item)=> item._id===course);

        // if Course is already present to cart
        if(index >=0){
            state.totalItems--;
            state.total-=state.cart[index].price;
            state.cart.splice(index,1);
            
            // upadet to localStorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
            toast.success("Course removed from cart")
        }
    },
    resetCart: (state)=>{
        state.cart=[];
        state.total=0;
        state.totalItems=0;

        // Update to localstorage
        localStorage.removeItem("cart")
        localStorage.removeItem("total")
        localStorage.removeItem("totalItems")
    }
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;

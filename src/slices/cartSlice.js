import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        setUser(state, value){
            state.token = value.payload;
        }
    }
});

export const {setUser} = cartSlice.actions;
export default cartSlice.reducers;
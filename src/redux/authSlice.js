import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        signupData:null,
    },
    reducers:{
        // actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSignupData:(state,action)=> {
            state.signupData = action.payload;
        }
    }
});
export const {
    setAuthUser, 
    setSignupData
} = authSlice.actions;
export default authSlice.reducer;
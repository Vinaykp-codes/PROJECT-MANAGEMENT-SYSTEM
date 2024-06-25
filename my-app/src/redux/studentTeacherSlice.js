import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
export const studentTeacherThunk=createAsyncThunk("student-teacher-login",async(userCredObj,thunkApi)=>{
    try{
        const url = userCredObj.userType === 'student' 
        ? 'http://localhost:4000/student-api/signin' 
        : 'http://localhost:4000/teacher-api/signin';
      
      const res = await axios.post(url, userCredObj);

            if(res.data.message==="signin success"){
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("user",JSON.stringify(res.data.user))
            }else{
                return thunkApi.rejectWithValue(res.data.message);
            }
            return res.data;
        
       
    }catch(err){
        return thunkApi.rejectWithValue(err);
    }
});
    export const studentTeacherSlice=createSlice({
        name:"student-teacher-login",
        initialState:{
            isPending:false,
            loginUserStatus:!!localStorage.getItem('token'),
            currentUser:JSON.parse(localStorage.getItem('user'))||{},
            errorOccured:false,
            errMsg:''
        },
        reducers:{
            resetState:(state,action)=>{
                state.isPending=false;
                state.currentUser={};
                state.loginUserStatus=false;
                state.errorOccured=false;
                state.errMsg='';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },
        extraReducers:builder=>builder
        .addCase(studentTeacherThunk.pending,(state,action)=>{
            state.isPending=true;
        })
        .addCase(studentTeacherThunk.fulfilled,(state,action)=>{
            state.isPending=false;
            state.currentUser=action.payload?action.payload.user:{};
            state.loginUserStatus=true;
            state.errMsg=''
            state.errorOccured=false;
        })
        .addCase(studentTeacherThunk.rejected,(state,action)=>{
            state.isPending=false;
            state.currentUser={};
            state.loginUserStatus=false;
            state.errMsg=action.payload;
            state.errorOccured=true;
        })
    });
    export const {resetState}=studentTeacherSlice.actions;
    export default studentTeacherSlice.reducer;


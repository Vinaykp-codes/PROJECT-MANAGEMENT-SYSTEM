import {configureStore} from '@reduxjs/toolkit'
import studentTeacherReducer from './studentTeacherSlice';
export const store=configureStore({
    reducer:{
        studentTeacher:studentTeacherReducer
    }
})
export default store;
import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "../features/counter/counterSlice";
import postReducer from '../posts/postsSlice'
import userReducer from '../posts/user/userSlice'
import { combineReducers } from 'redux'
const reducer = combineReducers({
	posts:postReducer,
	users:userReducer
})

export  const store=configureStore({
	reducer
});
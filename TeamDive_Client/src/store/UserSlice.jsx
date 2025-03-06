import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    
    memberId:'',
    password:'',
    name:'',
    nickname:'',
    phone:'',
    email:'',
    zipCode:'',
    address:'',
    address_detail:'',
    address_extra:'',
    birth:'',
    gender:'',
    image:'',
    indate:'',
    provider:'',
    memberKey:'',
    introduction:'',
    rolename:[],
    accessToken:'',
    refreshToken:'',
}

const getLoginUser=()=>{
    const memberInfo = cookies.get('user');
    if(memberInfo && memberInfo.memberId){
        memberInfo.memberId = decodeURIComponent(memberInfo.memberId);
        memberInfo.password  = decodeURIComponent(memberInfo.password);
        memberInfo.name = decodeURIComponent(memberInfo.name);
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
        memberInfo.phone = decodeURIComponent(memberInfo.phone);
        memberInfo.email = decodeURIComponent(memberInfo.email);
        memberInfo.zipCode = decodeURIComponent(memberInfo.zipCode);
        memberInfo.address = decodeURIComponent(memberInfo.address);
        memberInfo.address_detail  = decodeURIComponent(memberInfo.address_detail);
        memberInfo.address_extra = decodeURIComponent(memberInfo.address_extra);
        memberInfo.birth = decodeURIComponent(memberInfo.birth);
        memberInfo.gender = decodeURIComponent(memberInfo.gender);
        memberInfo.image = decodeURIComponent(memberInfo.image);
        memberInfo.indate = decodeURIComponent(memberInfo.indate);
        memberInfo.provider = decodeURIComponent(memberInfo.provider);
        memberInfo.memberKey = decodeURIComponent(memberInfo.memberKey);
        memberInfo.introduction = decodeURIComponent(memberInfo.introduction);
        memberInfo.rolename = decodeURIComponent(memberInfo.rolename);
        memberInfo.accessToken = decodeURIComponent(memberInfo.accessToken);
        memberInfo.refreshToken = decodeURIComponent(memberInfo.refreshToken);
    };
    return memberInfo;
}

export const UserSlice = createSlice(
    {
        name:'user',
        initialState : getLoginUser() || initialState,
        reducers:{
            loginAction :(state, action)=>{
                state.memberId = action.payload.memberId;
                state.password = action.payload.password;
                state.name = action.payload.name;
                state.nickname = action.payload.nickname;
                state.phone = action.payload.phone;
                state.email = action.payload.email;
                state.zipCode = action.payload.zipCode;
                state.address = action.payload.address;
                state.address_detail = action.payload.address_detail;
                state.address_extra = action.payload.address_extra;
                state.birth = action.payload.birth;
                state.gender = action.payload.gender;
                state.image = action.payload.image;
                state.indate = action.payload.indate;
                state.provider = action.payload.provider;
                state.memberKey = action.payload.memberKey;
                state.introduction = action.payload.introduction;
                state.rolename = action.payload.rolename;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            },
            logoutAction :(state)=>{
                state.memberId = '';
                state.password = '';
                state.name = '';
                state.nickname = '';
                state.phone = '';
                state.email = '';
                state.zipCode = '';
                state.address = '';
                state.address_detail = '';
                state.address_extra = '';
                state.birth = '';
                state.gender = '';
                state.image = '';
                state.indate = '';
                state.provider = '';
                state.memberKey = '';
                state.introduction = '';
                state.rolename = '';
                state.accessToken = '';
                state.refreshToken = '';
            }
        }
    }
)

export const { loginAction, logoutAction} = UserSlice.actions
export default UserSlice.reducer



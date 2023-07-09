import { defineStore } from "pinia";
export const useStore =defineStore("user",{
    state: ():userInfo => {
        return {
            userInfo: {
                userId:NaN,
            },
            // pathname:""
        }
    },
    actions: {
        setUserInfo(profile:{userId:number,[propname:string]:any}) {
            this.userInfo=profile
        },
        // setPathName(){
        //     this.pathname=window.location.pathname
        // }
    }
});

interface userInfo{
    userInfo:{userId:number,[propname:string]:any}
}
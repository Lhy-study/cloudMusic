import {defineStore} from "pinia";
export const elementStore=defineStore("flag",{
    state:()=>{
        return{
            isDrawer:false,//控制显示歌词页是否展示
            rightRrawer:false,
        }
    },
    actions:{
        changeDrawer(){
            this.isDrawer=!this.isDrawer;
            // console.log('isDrawer');
        },
        changeRightDrawer(){
            this.rightRrawer=!this.rightRrawer;
        },
        rightDrawerClose(){
            this.rightRrawer=false;
        }
    }
});
import { defineStore } from "pinia";
export const styleStore=defineStore("style",{ //setting.vue组建中主题 和主题颜色的
    state:()=>{
        return {
            checkMode:"",
            checkTheme:"",
        }
    },
    actions:{
        changeTheme(theme:string){
            this.checkTheme=theme;
            // window.localStorage.setItem("theme",theme);
        },
        changeMode(mode:string){
            this.checkMode=mode;
            // window.localStorage.setItem("mode",mode);
        }
    }
});

export const lrcStore=defineStore("lyric",{ //设置界面中歌词翻译、评论选项是否开启
    state:()=>{
        return {
            lrc:false,
            msg:false,
        }
    },
    actions:{
        changeVal(key:string){
            if(key=="lrc"){
                this.lrc=!this.lrc;
            }else if(key == "msg"){
                this.msg=!this.msg;
            }
        },
        changeLrc(val:boolean){
            this.lrc=val;
        },
        changeMsg(val:boolean){
            this.msg=val
        },
    }
});


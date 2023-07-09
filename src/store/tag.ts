import { defineStore } from "pinia";
import {plTag} from "../type/index"; 
export const plTagState =defineStore("plTag",{
    state:() : {plInfo:plTag,hightTags:string[],checkHight:string}=>({
       plInfo:{
           name:"华语",
           hot:true,
           category:0, 
       },
       hightTags:[],
       checkHight:'华语',
    }),

    actions:{
        setInfo(info:plTag){
            this.plInfo=info;
        },
        setHightTags(tags:string[]){
            this.hightTags=tags;
        },
        setCheckHight(tag:string){
            this.checkHight=tag;
        }
    }
});
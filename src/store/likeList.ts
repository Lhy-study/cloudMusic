import  {defineStore} from "pinia";

export const likeList = defineStore("likeList",{
    state:()=>{
        return{
            likelists:[] as number[]
        }
    },

    actions:{
        setLikeList(arr:number[]){
            this.likelists=arr;
        }
    }
});


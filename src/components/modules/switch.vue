<template>
  <input type="checkbox" class="switch"  ref="Rswitch"  @change="ch(prop1,prop2 as string)" :checked="prop1">
</template>

<script setup lang="ts">
    import {lrcStore} from "../../store/setting" 
    import {ref,onMounted} from "vue";

    const Rswitch=ref<HTMLInputElement|null>(null);
    const {changeVal} =lrcStore();
    defineProps({
        prop1:Boolean,
        prop2:String
    });
    function ch(prop1:boolean,prop2:string){
        // if(Rswitch==HTMLInputElement){

        // }
        /**
         * 通过ref绑定的话
         */
        if(Rswitch.value?.checked){//如果switch是选中状态，
            changeVal(prop2);
            // console.log(prop2);
            // let bol=storeToRefs(settingState)[`${prop2}`].value;
            // console.log(bol);
            localStorage.setItem(`${prop2}`,JSON.stringify(!prop1));
            // console.log(true);
        }else{
            changeVal(prop2);
            localStorage.setItem(`${prop2}`,JSON.stringify(!prop1));
        }
    }
    onMounted(()=>{
    //    Rswitch.value.checked()
    // console.log(Rswitch.value);
    });
    // console.log(value1.value);
    
</script>

<style scoped lang="less">
    .switch{
        cursor: pointer;
        /* // box-sizing: border-box; */
        width: 60px;
        height: 30px;
        appearance: none;
        /* // -webkit-appearance: none; */
        background-color: #bfbfbf;
        border-radius: 30px;
        outline: 2px solid black;
        position: relative;
    }
    .switch:checked{
        background-color: #D3A77D;
    }
    .switch::before{
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: white;
    }
    .switch:checked::before{
        left: 50%;
        background-color: @textColor;
    }
</style>
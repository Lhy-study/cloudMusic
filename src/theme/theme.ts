import { themes,modes } from "./model";
const changeStyle=(obj:{[propname:string]:any})=>{
    for(let key in obj){
        document.getElementsByTagName("body")[0]
        .style.setProperty(`--${key}`,obj[key]);
    }
}

export const setTheme=(themeName:string)=>{
    window.localStorage.setItem("theme",themeName);//保存主题色到本地
    const themeConfig=themes[themeName];
    if(themeConfig){
        localStorage.setItem("bgColor",themeConfig.bgColor);
        localStorage.setItem("textColor",themeConfig.textColor);
        localStorage.setItem("buttonColor",themeConfig.buttonColor);
        localStorage.setItem("startColor",themeConfig.startColor);
        changeStyle(themeConfig);//改变样式
    }else{
        let themeConfig={
            bgColor:localStorage.getItem("bgColor"),
            textColor:localStorage.getItem("textColor"),
            buttonColor:localStorage.getItem("buttonColor"),
            startColor:localStorage.getItem("startColor"),
        };
        changeStyle(themeConfig);
    }
} 

export const setMode=(modeName:string)=>{
    window.localStorage.setItem("mode",modeName);
    const themeConfig=modes[modeName];
    if(themeConfig){
        localStorage.setItem("modeBgColor",themeConfig.modeBgColor);
        localStorage.setItem("modeTextColor",themeConfig.modeTextColor);
        localStorage.setItem("modeThumbColor",themeConfig.modeThumbColor);
        localStorage.setItem("modePColor",themeConfig.modePColor);
        localStorage.setItem("modePageColor",themeConfig.modePageColor);
        changeStyle(themeConfig);//改变样式
    }else{
        let themeConfig={
            modeBgColor:localStorage.getItem("modeBgColor"),
            modeTextColor:localStorage.getItem("modeTextColor"),
            modeThumbColor:localStorage.getItem("modeThumbColor"),
            modepPColor:localStorage.getItem("modePColor"),
            modePageColor:localStorage.getItem("modePageColor"),
        };
        changeStyle(themeConfig);
    }
}
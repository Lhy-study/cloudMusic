//节流
export function throttle<T extends (...args:any)=>void >(fn:T,delay:number){
    let timer:any;;
    return function(this:ThisParameterType<T>,...args:any){
        if(!timer){
            timer=setTimeout(()=>{
                fn.apply(this,args);
                timer=null;
            },delay * 1000)
        }
    }
}

//防抖
export function debounce<T extends (...args:any)=>void >(fn:T,delay:number){
    let timer:any;
    return function(this:ThisParameterType<T>,...args:any){
        if(timer){
            clearTimeout(timer);
        }else{
            timer=setTimeout(()=>{
                fn.apply(this,args);
            },delay * 1000)
        }
    }
}
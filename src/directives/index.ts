export const lazyImg= {
    mounted:(el:HTMLImageElement)=>{
        // console.log(el);
        // console.log(binding.value);
        const obServer=new IntersectionObserver(([{isIntersecting}])=>{
            if(isIntersecting){//如果出现在视口中
                // console.log(el.getAttribute("data-src"));
                
                // console.log(binding);
                el.src=el.getAttribute("data-src")!;
                obServer.unobserve(el);//取消监听
            }
        });
        obServer.observe(el);

        // if(el.ty){

        // }
    }
}
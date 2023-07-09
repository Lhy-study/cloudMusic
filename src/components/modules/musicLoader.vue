<template>
    <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<style scoped lang="less">
    .loading{
            width: 3rem;
            height: 3rem;
            display: flex;
            justify-content: space-between;
            transform: rotate(180deg) scale(.8);

            span{
                display: block;
                width: 10%;
                background: @startColor;
                border-radius: 4px;
                animation: loading 1.2s infinite;
                }
            span:nth-of-type(1){
                animation-delay: .15s ;

            }
            span:nth-of-type(2){
                animation-delay: .3s ;

            }
            span:nth-of-type(3){
                animation-delay: .45s ;

            }
            span:nth-of-type(4){
                animation-delay: .6s ;

            }
            @keyframes loading {
                0%,100%{
                    height: 1rem;
                }
                25%{
                    height: 3rem;
                }
                50%{
                    height: 2rem;
                }
                75%{
                    height: 3rem;
                }
            }
        }
</style>
// import Cover  from "./assets/OIP-C.jpg";
import userImg from "./assets/user.jpg";
import Cover from "./assets/loading.png";
import  NoData from "./assets/没有数据.png";
import errorImg from "./assets/error.jpg";

export const image={Cover,userImg,NoData,errorImg};
export const page={smallPage:30,middlePage:70,bigPage:100};
export const deplay=300;

export const dealImgError=(e:Event)=>{
    if(e.type==="error"){
        // console.log(e);
        const target=e.target as HTMLImageElement;
        target.src=image.errorImg;
        target.onerror=null;
    }
}
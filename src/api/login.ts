import axios from "axios";
export const getKey = async () => {
    // let qrimg=null;
    // let {data} = await axios.get(`/login/qr/key/${Date()}`);
    // let { data } = await axios({
    //     url: `/login/qr/key/${Date()}`,
    //     method: "get",
    // });
    return  axios.get(`/login/qr/key?timestamp=${Date.now()}`);
}

export const getQring = async (key:string) => {
    return axios.get(`/login/qr/create?key=${key}&timestamp=${Date.now()}&qrimg=?`)
}

export const Login = async (key:string) => {
    return axios.get(`/login/qr/check?key=${key}&timestamp=${Date.now()}`,{withCredentials:true});
}


export const logOut=()=>{
    return axios.get(`/logout`);
}

export const getStatus=()=>{
    return axios.get(`/login/status/timetamp=${Date.now()}`);
}
    // setTimeout(() => {
    //     let timer = setInterval(async () => {
    //         // console.log(date,3);
    //         let res = await axios.get(`/login/qr/check?key=${key.value}`, { withCredentials: true });
    //         if (res.data.code == 803) {
    //             alert("登录成功");
    //             clearInterval(timer);
    //         }
    //         console.log(res.data);
    //     }, 5000);
    // }, 2000);

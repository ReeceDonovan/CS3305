
import {request} from "./index"


export interface User {
    name: string,
    email: string,
    bio: string,
    school: string,
    role: string
}

const get_me = async ()=>{
    let res = await request({method: "GET", path: "/users"})
    return res.data as User
}

export default get_me
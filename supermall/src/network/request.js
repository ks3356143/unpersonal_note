import axios from "axios";

export function request(config) {
    const instance1 = axios.create({
        baseURL:'http://127.0.0.1',
        timeout:5000
    })

    return instance1(config)
}
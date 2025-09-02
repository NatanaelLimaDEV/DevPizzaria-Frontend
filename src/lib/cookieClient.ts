import { getCookie } from "cookies-next";


export function getCookieClient() {
    const token = getCookie("sesseion")

    return token
}
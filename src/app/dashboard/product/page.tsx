import { getCookieServer } from "@/lib/cookieServer";
import { Form } from "./components/form";
import { api } from "@/services/api";

async function getProducts() {
    const token = await getCookieServer()

    const response = await api.get("/category/product", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}

export default async function Product() {
    const products = await getProducts()

    const token = await getCookieServer()

    const response = await api.get("/category", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return (
        <>
            <Form categories={response.data} products={products} />
        </>

    )
}
import { getCookieServer } from '@/lib/cookieServer'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { Form } from './components/form'

async function getOrders() {
    const token = await getCookieServer()

    const response = await api.get("/orders", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}

export default function NewOrder() {

    async function handleAddOrder(formData: FormData) {
        "use server"

        const orders = await getOrders()

        const table = formData.get("table")
        const name = formData.get("name")

        if (table === "") {
            return { error: "Informe o número da mesa" }
        }

        if (orders.find((order: any) => order.table === Number(table))) {
            return { error: "Mesa ocupada" }
        }

        const data = {
            table: Number(table),
            name: name ? name : null
        }

        const token = await getCookieServer()

        const response = await api.post("/order", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch ((err) => {
            console.log(err)
            return { error: "Erro ao criar pedido" }
        })

        if ('error' in response) {
            return response
        }

        const orderId = response.data.id

        redirect(`/dashboard/selectItems/${orderId}`)


    }

    return (
        <Form action={handleAddOrder} />
    )
}
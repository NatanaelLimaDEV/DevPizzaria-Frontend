"use client"

import { Button } from "@/app/dashboard/components/button"
import styles from "./styles.module.scss"
import { redirect, useRouter } from "next/navigation"
import { getCookieClient } from "@/lib/cookieClient"
import { api } from "@/services/api"
import { CategoriesProps } from "@/lib/categories.type"
import { toast } from "sonner"
import { X } from "lucide-react"
import { ProductProps } from "@/lib/product.type"

interface Props {
    categories: CategoriesProps[]
}

async function getProducts(): Promise<ProductProps[] | []> {
    try {
        const token = await getCookieClient()

        const response = await api.get("/category/product", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data || []
    } catch (err) {
        console.log(err)
        return []
    }
}

export function Form({ categories }: Props) {
    const router = useRouter()

    async function handleRegisterCategory(formData: FormData) {

        const name = formData.get("name")

        if (name === "") return

        const categoryExists = categories.find((category: any) => category.name === name)

        if (categoryExists) {
            toast.warning("Categoria ja cadastrada, por favor escolha outro nome")
            return
        }

        const data = {
            name: name,
        }

        const token = await getCookieClient()

        await api.post("/category", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .catch((err) => {
                console.log(err)
                return
            })

        toast.success("Categoria cadastrada com sucesso!")

        redirect("/dashboard/category")
    }

    async function handleRemoveCategory(category_id: string) {
        try {
            const products = await getProducts()

            if (products.find((product: any) => product.category_id === category_id)) {
                toast.error("Categoria vinculada a um produto, impossivel deletar")
                return
            }

            const token = await getCookieClient()

            await api.delete("/category/delete", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    category_id: category_id
                }
            })

            toast.success("Categoria removida com sucesso!")
            router.refresh()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao remover categoria")
            return
        }
    }

    return (
        <>
            <h1>Nova Categoria</h1>

            <form className={styles.form} action={handleRegisterCategory}>
                <input type="text" name='name' placeholder='Nome da categoria, ex: Pizza' required className={styles.input} />

                <Button name='Cadastrar' />
            </form>

            <section className={styles.categories}>
                <h2>Categorias cadastradas</h2>
                <hr />
                <ul>
                    {categories.map((category: any) => (
                        <li key={category.id}>
                            <span>{category.name}</span>
                            <button type='button' onClick={() => handleRemoveCategory(category.id)}>
                                <X />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}
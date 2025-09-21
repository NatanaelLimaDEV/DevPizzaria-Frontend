"use client"

import { Button } from "@/app/dashboard/components/button"
import styles from "./styles.module.scss"
import { redirect } from "next/navigation"
import { getCookieClient } from "@/lib/cookieClient"
import { api } from "@/services/api"
import { CategoriesProps } from "@/lib/categories.type"
import { toast } from "sonner"

interface Props {
    categories: CategoriesProps[]
}

export function Form({ categories }: Props) {

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


    return (
        <>
            <h1>Nova Categoria</h1>

            <form className={styles.form} action={handleRegisterCategory}>
                <input type="text" name='name' placeholder='Nome da categoria, ex: Pizza' required className={styles.input} />

                <Button name='Cadastrar' />
            </form>
        </>
    )
}
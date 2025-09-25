"use client"

import { UploadCloud, X } from 'lucide-react'
import styles from './styles.module.scss'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/app/dashboard/components/button'
import { getCookieClient } from '@/lib/cookieClient'
import { api } from '@/services/api'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import { ProductProps } from '@/lib/product.type'
import { ItemProps } from '@/lib/item.type'

interface CategoryProps {
    id: string;
    name: string;
}

interface Props {
    categories: CategoryProps[]
    products: ProductProps[]
}

async function getItems(): Promise<ItemProps[] | []> {
    try {
        const token = getCookieClient()

        const response = await api.get("/order/detail", {
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

export function Form({ categories, products }: Props) {
    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")

    const router = useRouter()

    async function handleRegisterProduct(formData: FormData) {

        const categoryIndex = formData.get("category")
        const name = formData.get("name")
        const price = formData.get("price")
        const description = formData.get("description")

        if (!name || !categoryIndex || !price || !description || !image) {
            toast.warning("Preencha todos os campos")
            return
        }

        // Verificar se o produto já existe
        const productExists = products.find(product => product.name === name)

        if (productExists) {
            toast.warning("Produto ja cadastrado, por favor escolha outro nome")
            return
        }

        const data = new FormData()

        data.append("name", name)
        data.append("price", price)
        data.append("description", description)
        data.append("category_id", categories[Number(categoryIndex)].id)
        data.append("file", image)

        const token = getCookieClient()

        await api.post("/product", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .catch((err) => {
                console.log(err)
                toast.warning("Erro ao cadastrar produto")
                return
            })

        toast.success("Produto cadastrado com sucesso!")
        redirect("/dashboard/product")
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type !== "image/png" && image.type !== "image/jpeg") {
                toast.warning("Apenas imagens PNG ou JPEG são aceitas")
                return
            }

            setImage(image)
            setPreviewImage(URL.createObjectURL(image))
        }
    }

    async function handleDeleteProduct(product_id: string) {
        try {

            const items = await getItems()

            if (items.find(item => item.product_id === product_id)) {
                toast.error("Produto vinculado a um pedido pendente, impossivel deletar")
                return
            }

            const token = getCookieClient()

            await api.delete('/product/delete', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    product_id,
                }
            })

            toast.success("Produto deletado com sucesso!")
            router.refresh()
        } catch (err: any) {
            console.log(err)
            toast.error("Erro ao deletar produto")
            return
        }
    }

    return (
        <main className={styles.container}>
            <h1>Novo produto</h1>

            <form className={styles.form} action={handleRegisterProduct}>
                <label className={styles.labelImage}>
                    <span>
                        <UploadCloud size={30} color='#fff' />
                    </span>

                    <input type="file" accept="image/png, image/jpeg" required onChange={handleFile} />

                    {previewImage && (
                        <Image
                            alt='Imagem de preview'
                            src={previewImage}
                            className={styles.preview}
                            fill={true}
                            quality={100}
                            priority={true}
                        />
                    )}
                </label>

                <select name="category">
                    {categories.map((category, index) => (
                        <option key={category.id} value={index}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <input type="text" name='name' placeholder='Digite o nome do produto...' required className={styles.input} />

                <input type="text" name='price' placeholder='Preço do produto...' required className={styles.input} />

                <textarea className={styles.input} placeholder='Digite a descricao do produto...' required name="description"></textarea>

                <Button name="Salvar" />
            </form>

            <section className={styles.container}>
                <h2>Categorias</h2>
                <hr />
                {categories.map((category: any) => (
                    <div key={category.id}>
                        <h2>{category.name}</h2>

                        {products.filter((product: any) => product.category_id === category.id).length === 0 && (
                            <div className={styles.containerProduct}>
                                <p>Não há produtos nesta categoria</p>
                            </div>
                        )}

                        {products.filter((product: any) => product.category_id === category.id).map((product: any) => (
                            <div key={product.id}>
                                <div className={styles.containerProduct}>
                                    <div className={styles.containerInfoProduct}>
                                        <img src={product.banner} alt={product.name} />
                                        <div className={styles.containerInfo}>
                                            <h3>{product.name}</h3>
                                            <div>
                                                <p>{product.description}</p>
                                                <p>R$ {product.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.containerButtons}>
                                        <button onClick={() => handleDeleteProduct(product.id)}>
                                            <X size={24} color='#fff' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </main>
    )
}
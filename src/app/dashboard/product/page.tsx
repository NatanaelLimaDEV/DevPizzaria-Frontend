import { getCookieServer } from "@/lib/cookieServer";
import { Form } from "./components/form";
import { api } from "@/services/api";
import styles from "./styles.module.scss"

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

            <section className={styles.container}>
                <h2>Categorias</h2>
                <hr />
                {response.data.map((category: any) => (
                    <div key={category.id}>
                        <h2>{category.name}</h2>

                        {products.filter((product: any) => product.category_id === category.id).length === 0 && (
                            <p>Não há produtos nesta categoria</p>
                        )}

                        {products.filter((product: any) => product.category_id === category.id).map((product: any) => (
                            <div key={product.id}>
                                <div className={styles.containerProduct}>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p>R$ {product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </>

    )
}
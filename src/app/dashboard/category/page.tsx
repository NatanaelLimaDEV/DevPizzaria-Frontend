import { api } from '@/services/api'
import styles from './styles.module.scss'
import { getCookieServer } from '@/lib/cookieServer'
import { Form } from './components/form'

async function getCategories() {
    const token = await getCookieServer()

    const response = await api.get("/category", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}

export default async function Category() {
    const categories = await getCategories()

    return (
        <main className={styles.container}>

            <Form categories={categories} />
            
            <section className={styles.categories}>
                <h2>Categorias cadastradas</h2>
                <hr />
                <ul>
                    {categories.map((category: any) => (
                        <li key={category.id}>{category.name}</li>
                    ))}
                </ul>
            </section>
        </main>
    )
}
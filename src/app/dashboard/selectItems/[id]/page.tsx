import { getCookieServer } from '@/lib/cookieServer';
import styles from './styles.module.scss';
import { api } from '@/services/api';
import { ItemProps } from '@/lib/item.type';
import { CategoriesProps } from '@/lib/categories.type';
import { Form } from './components/form';

async function getItems(): Promise<ItemProps[] | []> {
    try {
        const token = await getCookieServer()

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

async function getCategories(): Promise<CategoriesProps[] | []> {
    try {
        const token = await getCookieServer()

        const response = await api.get("/category", {
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



export default async function SelectItems() {

    const items = await getItems()
    const categories = await getCategories()


    return (
        <main className={styles.container}>
            <h1>Selecionar itens</h1>

            <Form categories={categories} items={items}/>
        </main>
    )
}
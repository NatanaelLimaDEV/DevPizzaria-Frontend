import { getCookieServer } from '@/lib/cookieServer';
import styles from './styles.module.scss';
import { api } from '@/services/api';
import { ProductProps } from '@/lib/product.type';
import { CategoriesProps } from '@/lib/categories.type';
import { Form } from './components/form';
import { ItemProps } from '@/lib/item.type';

async function getProducts(): Promise<ProductProps[] | []> {
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

async function getItemsOrder(): Promise<ItemProps[] | []> {
    try {
        const token = await getCookieServer();

        const response = await api.get("/order/detail", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data || [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

export default async function SelectItems() {

    const products = await getProducts()
    const categories = await getCategories()
    const itemsOrder = await getItemsOrder()


    return (
        <main className={styles.container}>
            <h1>Selecionar itens</h1>

            <Form categories={categories} products={products} itemsOrder={itemsOrder}/>
        </main>
    )
}
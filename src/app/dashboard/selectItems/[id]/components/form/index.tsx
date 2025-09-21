"use client"

import { Minus, PlusCircle } from 'lucide-react'
import styles from './styles.module.scss'
import { CategoriesProps } from '@/lib/categories.type'
import { ProductProps } from '@/lib/product.type'
import { useEffect, useState } from 'react'
import { Button } from '../../../../components/button'
import { useParams, useRouter } from 'next/navigation'
import { getCookieClient } from '@/lib/cookieClient'
import { api } from '@/services/api'
import { toast } from 'sonner'
import { ItemProps } from '@/lib/item.type'

interface Props {
    categories: CategoriesProps[]
    products: ProductProps[]
    itemsOrder: ItemProps[]
}

export function Form({ categories, products, itemsOrder }: Props) {
    const router = useRouter()
    const params = useParams()
    const order_id = params.id

    const [amounts, setAmounts] = useState<{ [key: string]: number }>({})

    function handleIncrease(productId: string) {
        setAmounts(prevState => ({
            ...prevState,
            [productId]: (prevState[productId] || 0) + 1
        }))
    }

    function handleDecrease(productId: string) {
        setAmounts(prevState => ({
            ...prevState,
            [productId]: Math.max((prevState[productId] || 0) - 1, 0) // Use Math.max para garantir que o valor não seja negativo
        }))
    }

    function handleChange(productId: string, value: string) {
        const num = parseInt(value, 10) // Converte o valor para um número inteiro
        setAmounts(prevState => ({
            ...prevState,
            [productId]: isNaN(num) ? 0 : Math.max(num, 0) // Use Math.max para garantir que o valor não seja negativo
        }))
    }

    // Função para verificar se o item já foi adicionado ao pedido
    function checkItemAdded() {
        itemsOrder
            .filter(orderId => orderId.order_id === order_id)
            .forEach(item => {
                setAmounts(prevState => ({
                    ...prevState,
                    [item.product_id]: item.amount
                }))
            })
    }

    useEffect(() => {
        checkItemAdded()
    }, [])

    async function addProduct(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = products.map(product => ({
            product_id: product.id,
            amount: amounts[product.id] || 0
        }))


        const token = getCookieClient()

        for (const product of data) {
            try {
                // verifica se o item ja foi adicionado ao pedido
                const itemAdded = itemsOrder.find(item => item.order_id === order_id && item.product_id === product.product_id)

                if (itemAdded && product.amount > 0) {
                    // se o item já existe no pedido, atualiza a quantidade
                    await api.put('/order/update', {
                        order_id: order_id,
                        product_id: product.product_id,
                        amount: product.amount
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                } else if (!itemAdded && product.amount > 0) {
                    // adicona o item ao pedido
                    await api.post('/order/add', {
                        order_id: order_id,
                        product_id: product.product_id,
                        amount: product.amount
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                } else if (itemAdded && product.amount === 0) {
                    // remove o item do pedido
                    await api.delete('/order/remove/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            item_id: itemAdded.id
                        }
                    })
                }
            } catch (err) {
                console.log(err)
                toast.warning(`Erro ao adcionar produto ao pedido ${product.product_id}`)
                return
            }
        }

        await api.put('/order/send', { order_id: order_id }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        toast.success("Produto(s) adicionado(s) com sucesso!")

        router.push('/dashboard')
    }

    return (
        <>
            <form className={styles.form} onSubmit={addProduct}>
                {categories.map((category) => (
                    <section key={category.id} className={styles.category}>
                        <h2>{category.name}</h2>

                        {products.filter(product => product.category_id === category.id).length === 0 && (
                            <span className={styles.emptyproduct}>Nenhum produto cadastrado</span>
                        )}

                        {products.filter(product => product.category_id === category.id).map((product) => (
                            <div key={product.id} className={styles.product}>
                                <div>
                                    <img src={`http://localhost:3333/files/${product.banner}`} alt={product.name} />
                                    <span>{product.name}</span>
                                    <span>R$ {product.price}</span>
                                </div>
                                <div className={styles.amountContainer}>
                                    <button type="button" className={styles.buttonMinus} onClick={() => handleDecrease(product.id)}>
                                        <Minus size={24} />
                                    </button>
                                    <input type="text"
                                        placeholder="0"
                                        className={styles.inputAmount} value={amounts[product.id] || 0} onChange={(e) => handleChange(product.id, e.target.value)} />
                                    <button type="button" className={styles.buttonPlus} onClick={() => handleIncrease(product.id)}>
                                        <PlusCircle size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                ))}

                <Button name="Confirmar pedido" />
            </form>
        </>
    )
}
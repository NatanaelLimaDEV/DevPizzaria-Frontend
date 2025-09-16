"use client"

import { Minus, PlusCircle } from 'lucide-react'
import styles from './styles.module.scss'
import { CategoriesProps } from '@/lib/categories.type'
import { ItemProps } from '@/lib/item.type'
import { useState } from 'react'
import { Button } from '../../../../components/button'
import { useParams, useRouter } from 'next/navigation'
import { getCookieClient } from '@/lib/cookieClient'
import { api } from '@/services/api'
import { toast } from 'sonner'

interface Props {
    categories: CategoriesProps[]
    items: ItemProps[]
}

export function Form({ categories, items }: Props) {
    const router = useRouter()
    const params = useParams()
    const order_id = params.id

    const [amounts, setAmounts] = useState<{ [key: string]: number }>({})

    function handleIncrease(itemId: string) {
        setAmounts(prevState => ({
            ...prevState,
            [itemId]: (prevState[itemId] || 0) + 1
        }))
    }

    function handleDecrease(itemId: string) {
        setAmounts(prevState => ({
            ...prevState,
            [itemId]: Math.max((prevState[itemId] || 0) - 1, 0) // Use Math.max para garantir que o valor não seja negativo
        }))
    }

    function handleChange(itemId: string, value: string) {
        const num = parseInt(value, 10) // Converte o valor para um número inteiro
        setAmounts(prevState => ({
            ...prevState,
            [itemId]: isNaN(num) ? 0 : Math.max(num, 0) // Use Math.max para garantir que o valor não seja negativo
        }))
    }

    async function addItem(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = items
            .filter((item) => (amounts[item.id] || 0) > 0) // Filtra apenas os itens com quantidade maior que zero
            .map(item => ({
                product_id: item.id,
                amount: amounts[item.id]
            }))


        const token = getCookieClient()

        for (const item of data) {
            try {
                await api.post('/order/add', {
                    order_id: order_id,
                    product_id: item.product_id,
                    amount: item.amount
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } catch (err) {
                console.log(err)
                toast.warning(`Erro ao adcionar produto ao pedido ${item.product_id}`)
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
            <form className={styles.form} onSubmit={addItem}>
                {categories.map((category) => (
                    <section key={category.id} className={styles.category}>
                        <h2>{category.name}</h2>

                        {items.filter(item => item.category_id === category.id).length === 0 && (
                            <span className={styles.emptyItem}>Nenhum item cadastrado</span>
                        )}

                        {items.filter(item => item.category_id === category.id).map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div>
                                    <img src={`http://localhost:3333/files/${item.banner}`} alt={item.name} />
                                    <span>{item.name}</span>
                                    <span>R$ {item.price}</span>
                                </div>
                                <div className={styles.amountContainer}>
                                    <button type="button" className={styles.buttonMinus} onClick={() => handleDecrease(item.id)}>
                                        <Minus size={24} />
                                    </button>
                                    <input type="text"
                                        placeholder="0"
                                        className={styles.inputAmount} value={amounts[item.id] || 0} onChange={(e) => handleChange(item.id, e.target.value)} />
                                    <button type="button" className={styles.buttonPlus} onClick={() => handleIncrease(item.id)}>
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
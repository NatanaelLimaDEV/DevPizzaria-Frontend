"use client"

import { Check, Pencil, X } from 'lucide-react';
import styles from './styles.module.scss';
import { use } from 'react'
import { OrderContext } from '@/providers/order';
import { calculateTotal } from '@/lib/helper';
import { useRouter } from 'next/navigation';

export function ModalOrder() {
    const { onRequestClose, order, finishOrder } = use(OrderContext)

    const router = useRouter()

    async function handleFinishOrder() {
        await finishOrder(order[0].order_id)
    }

    function handleEditOrder() {
        console.log(order[0].order_id)
        router.push(`/dashboard/selectItems/${order[0].order_id}`)
        onRequestClose()
    }

    return (
        <dialog className={styles.dialogContainer}>
            <section className={styles.dialogContent}>
                <button className={styles.dialogBack} onClick={onRequestClose}>
                    <X size={40} color='#fff' />
                </button>

                <article className={styles.container}>
                    <h2>Detalhes do pedido</h2>

                    <span className={styles.table}>
                        Mesa <b>{order[0].order.table}</b>
                    </span>

                    {order[0].order?.name && (
                        <span className={styles.name}>
                            <b>{order[0].order.name}</b>
                        </span>
                    )}

                    {order.map(item => (
                        <section className={styles.item} key={item.id}>
                            <span>Qtd: {item.amount} - <b>{item.product.name}</b> - R$ {parseFloat(item.product.price) * item.amount}</span>
                            <span className={styles.description}>{item.product.description}</span>
                        </section>
                    ))}

                    <h3 className={styles.total}>Valor total: R$ {calculateTotal(order)}</h3>

                    <div className={styles.orderButtons}>
                        <button className={styles.buttonOrderEdit} onClick={handleEditOrder}>
                            <Pencil size={14} />
                            Editar pedido
                        </button>
                        <button className={styles.buttonOrder} onClick={handleFinishOrder}>
                            <Check size={14} />
                            Concluir pedido
                            </button>
                    </div>
                </article>
            </section>
        </dialog>
    )
}
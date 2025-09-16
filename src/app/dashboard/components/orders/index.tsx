"use client"

import { use } from 'react'
import { PlusCircle, RefreshCw } from 'lucide-react';
import styles from './styles.module.scss';
import { OrderProps } from '@/lib/order.type';
import { ModalOrder } from '../modal';
import { OrderContext } from '@/providers/order';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
    orders: OrderProps[]
}

export function Orders({ orders }: Props) {
    const { isOpen, onRequestOpen } = use(OrderContext)
    const router = useRouter()

    async function handleDetailOrder(order_id: string) {
        await onRequestOpen(order_id)
    }

    function handleRefresh() {
        router.refresh()
        toast.success('Pedidos atualizados!')
    }

    function handleAddOrder() {
        router.push('/dashboard/newOrder')
    }

    return (
        <>
            <main className={styles.container}>
                <section className={styles.containerHeader}>
                    <div>
                        <h1>Últimos pedidos</h1>
                        <button onClick={handleRefresh}>
                            <RefreshCw size={24} color='#3fffa3' />
                        </button>
                    </div>
                    <div>
                        <button onClick={handleAddOrder}>
                            <span className={styles.nameButtonAdd}>
                            Novo pedido</span>
                            <PlusCircle size={24} color='#3fffa3' />
                        </button>
                    </div>
                </section>

                <section className={styles.listOrders}>
                    {orders.length === 0 && <span className={styles.emptyItem}>Nenhum pedido aberto no momento...</span>}

                    {orders.map(order => (
                        <button key={order.id} className={styles.orderItem} onClick={() => handleDetailOrder(order.id)}>
                            <div className={styles.tag}></div>
                            <span>Mesa {order.table}</span>
                        </button>
                    ))}
                </section>
            </main>

            {isOpen && <ModalOrder />}
        </>
    )
}
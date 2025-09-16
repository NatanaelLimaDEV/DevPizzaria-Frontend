"use client"

import { Minus, PlusCircle } from 'lucide-react'
import styles from './styles.module.scss'
import { useParams } from 'next/navigation'

interface Props {
    item_id: string
    typeButton: string
}

export function ButtonPlus({ item_id, typeButton }: Props) {
    const params = useParams()
    const order_id = params.id as string

    function handleAddItem() {
        alert(item_id+ " "+ order_id)
    }

    return (
        <button type='button' className={styles.buttonPlus} onClick={handleAddItem}>
            {typeButton === "plus" ? <PlusCircle size={24} color='#3fffa3' /> : <Minus size={24} color='#ff3f4b' />}
        </button>
    )
}
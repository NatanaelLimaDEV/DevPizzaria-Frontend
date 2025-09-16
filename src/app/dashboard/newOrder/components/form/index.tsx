"use client"

import { startTransition } from 'react'
import styles from './styles.module.scss'
import { Button } from '@/app/dashboard/components/button'
import { toast } from 'sonner'

export function Form({ action } : { action: (formData: FormData) => Promise<any> }) {

    async function handleSubmit(formData: FormData) {
        startTransition(async() => {
            const result = await action(formData)

            if (result?.error) {
                toast.warning(result.error)
            }
        })
    }

    return (
        <main className={styles.container} >
            <h1>Novo pedido</h1>

            <form className={styles.form} action={handleSubmit}>
                <input type="number" name='table' placeholder='Número da mesa' required className={styles.input} />
                <input type="text" name='name' placeholder='Nome do cliente (opcional)' className={styles.input} />
                <Button name='Criar pedido' />
            </form>
        </main>

    )
}
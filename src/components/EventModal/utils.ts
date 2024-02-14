import { FormEvent, SetStateAction } from 'react'
import { FormDataValidateschema, FormDataschema } from './schemas'
import { z } from 'zod'
import { emptyForm, errorsAtom, formDataAtom } from './state'
import { useAtom } from 'jotai'
import { SetAtom } from '@/src/types/types'

type FromData = z.infer<typeof FormDataschema>

const insertSupabase = async (e: FormEvent<HTMLFormElement>, formData: any) => {
    const [errors, setErrors] = useAtom(errorsAtom)

    e.preventDefault()
    let tempErrors = { title: '', type: '', deadlines: '' }
    const parsedData = FormDataValidateschema.safeParse(formData)
    if (parsedData.success) {
        setErrors(tempErrors)
        //@ts-ignore
        const { data, error } = await supabase
            .from('newEvent')
            .insert({
                title: formData.title,
                type: formData.type,
                deadlines: JSON.stringify(formData.deadlines),
            })
            .select()
            .single()
        if (error) {
            console.log(error)
            return
        }
    } else {
        const keys = ['title', 'type', 'deadlines']
        parsedData.error.issues.map((issue) => {
            keys.map((key) => {
                if (issue.path[0] === key) {
                    tempErrors = { ...tempErrors, [key]: issue.message }
                }
            })
        })
        setErrors(tempErrors)
    }
}

export default insertSupabase

export const addUpdateDeadline = (
    newDeadline: any,
    deadline: any,
    isEditing: boolean,
    [formData, setFormData]: [
        any,
        SetAtom<
            [
                SetStateAction<{
                    title: string
                    type: 'funding' | 'publication' | null
                    deadlines: {
                        name: string
                        timestamp: Date | null
                    }[]
                }>
            ],
            void
        >
    ]
) => {
    if (isEditing) {
        let filteredArray = formData.deadlines.filter(
            (e: any) => e !== deadline
        )
        setFormData({
            ...formData,
            deadlines: [...filteredArray, newDeadline],
        })
        return
    }
    setFormData({
        ...formData,
        deadlines: [...formData.deadlines, newDeadline],
    })
}

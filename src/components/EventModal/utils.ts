import { FormEvent } from 'react'
import { FormDataValidateschema, FormDataschema } from './schemas'
import { z } from 'zod'
import { emptyForm, errorsAtom, formDataAtom } from './state'
import { useAtom } from 'jotai'

type FromData = z.infer<typeof FormDataschema>

const insertSupabase = async (e: FormEvent<HTMLFormElement>) => {
    const [formData, setFormData] = useAtom(formDataAtom)
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
        setFormData(emptyForm as FromData)
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

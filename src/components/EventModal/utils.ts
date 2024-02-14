import { SetStateAction } from 'react'
import { FormDataschema } from './schemas'
import { z } from 'zod'
import { SetAtom } from '@/src/types/types'

type FromData = z.infer<typeof FormDataschema>

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

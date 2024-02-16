import { SetStateAction } from 'react'
import { SetAtom } from '@/src/types/types'

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

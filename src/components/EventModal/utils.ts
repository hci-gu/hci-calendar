import { SetStateAction } from 'react'
import { FormDataschema } from './schemas'
import { z } from 'zod'
import { SetAtom } from '@/src/types/types'
import moment from 'moment'

type FromData = z.infer<typeof FormDataschema>

export const calendarStart = () =>
    moment().subtract(1, 'months').startOf('month').toDate()
export const calendarEnd = () =>
    moment().add(11, 'months').endOf('month').toDate()

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

import { z } from 'zod'

export const FormDataValidateschema = z.object({
    title: z.string().min(3),
    type: z.enum(['funding', 'publication']),
    deadlines: z
        .object({
            name: z.string().min(1),
            timestamp: z.date().nullable(),
        })
        .array()
        .min(1),
})

export const FormDataschema = FormDataValidateschema.extend({
    type: z.enum(['funding', 'publication']).nullable(),
})
export const NewDeadlineValidateschema = z.object({
    name: z.string().min(1),
    timestamp: z.date(),
})

export const NewDeadlineschema = NewDeadlineValidateschema.extend({
    timestamp: z.date().nullable(),
})

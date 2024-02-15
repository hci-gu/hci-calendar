import { z } from 'zod'

export const deadlinesZod = z.object({
    name: z.string().min(3),
    timestamp: z.string().nullable(),
})

export type deadlinesType = z.infer<typeof deadlinesZod>; 

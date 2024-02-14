import { z } from 'zod'
import { FormDataschema } from './schemas'
import { atom } from 'jotai'

export type FromData = z.infer<typeof FormDataschema>
export const emptyForm = { title: '', type: null, deadlines: [] }
export const formDataAtom = atom<FromData>(emptyForm as FromData)
export const errorsAtom = atom({ title: '', type: '', deadlines: '' })
export const isEditingAtom = atom(false)
export type DeadlineType = { name: string; timestamp: Date | null }
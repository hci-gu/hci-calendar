import { z } from 'zod'
import { FormDataschema } from './schemas'
import { atom } from 'jotai'

type FromData = z.infer<typeof FormDataschema>
export const emptyForm = { title: '', type: null, deadlines: [] }
export const formDataAtom = atom<FromData>(emptyForm as FromData)

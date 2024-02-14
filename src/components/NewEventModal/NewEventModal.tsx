import {
    Button,
    Flex,
    Modal,
    Stack,
    Text,
    TextInput,
    useCombobox,
} from '@mantine/core'
import '@mantine/dates/styles.css'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { DateTimePicker } from '@mantine/dates'
import { FormEvent, useEffect, useState } from 'react'
import supabase, { eventsAtom } from '../../lib/state'
import { useAtom } from 'jotai'
import { dateToPosition, dateToWidth } from '../../lib/utils'
import { z } from 'zod'
import {
    FormDataschema,
    FormDataValidateschema,
    NewDeadlineschema,
    NewDeadlineValidateschema,
} from './schemas'
import { emptyForm, formDataAtom } from './state'
import Deadline from './SubComponents/deadline'
import DropdownSelect from './SubComponents/DropdownSelect'

const NewEventModal = () => {
    type FromData = z.infer<typeof FormDataschema>
    const [opend, { open, close }] = useDisclosure(false)
    const [formData, setFormData] = useAtom(formDataAtom)
    const [events, setEvents] = useAtom(eventsAtom)
    const viewport = useViewportSize()
    const [errors, setErrors] = useState({
        title: '',
        type: '',
        deadlines: '',
    })
    const [newErrors, setNewErrors] = useState({
        name: '',
        timestamp: '',
    })
    const [newDeadline, setNewDeadline] = useState<
        z.infer<typeof NewDeadlineschema>
    >({
        name: '',
        timestamp: null,
    })

    const addNewDeadline = () => {
        const parsedData = NewDeadlineValidateschema.safeParse(newDeadline)
        let tempErrors = { name: '', timestamp: '' }
        if (parsedData.success) {
            setNewErrors(tempErrors)
            setFormData({
                ...formData,
                deadlines: [...formData.deadlines, newDeadline],
            })
            setNewDeadline({
                name: '',
                timestamp: null,
            })
        } else {
            const keys = ['name', 'timestamp']
            parsedData.error.issues.map((issue) => {
                keys.map((key) => {
                    if (issue.path[0] === key) {
                        tempErrors = { ...tempErrors, [key]: issue.message }
                    }
                })
            })
            setNewErrors(tempErrors)
        }
    }

    const insertSupabase = async (e: FormEvent<HTMLFormElement>) => {
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

    useEffect(() => {
        console.log(errors, newErrors)
    }, [errors, newErrors])

    // useEffect(() => {
    //     console.log(formData.deadlines)
    // }, [formData.deadlines])
    return (
        <>
            <Modal
                title="New Event"
                opened={opend}
                onClose={close}
                centered
                radius={24}
            >
                <form onSubmit={(e) => insertSupabase(e)}>
                    <Flex align="center" direction="column" w="100%" gap={16}>
                        <Flex align="flex-end" gap={16} w="100%">
                            <TextInput
                                w="100%"
                                label="Event Title"
                                withAsterisk
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }}
                                error={errors.title !== '' ? errors.title : ''}
                            />
                            <DropdownSelect />
                        </Flex>
                        {errors.type !== '' && <Text>{errors.type}</Text>}
                        <Stack w={'100%'}>
                            {formData.deadlines.map((deadline) => (
                                <Deadline
                                    key={deadline.name}
                                    deadline={deadline}
                                />
                            ))}
                            {errors.deadlines !== '' && (
                                <Text>{errors.deadlines}</Text>
                            )}
                            <Flex align={'center'} w={'100%'}>
                                <Flex direction={'column'} gap={6} w={'100%'}>
                                    <TextInput
                                        size="sm"
                                        w={'45%'}
                                        placeholder="Deadline Name"
                                        value={newDeadline.name}
                                        onChange={(e) => {
                                            setNewDeadline({
                                                ...newDeadline,
                                                name: e.target.value,
                                            })
                                        }}
                                        error={
                                            newErrors.name !== ''
                                                ? newErrors.name
                                                : ''
                                        }
                                    />
                                    <DateTimePicker
                                        w={'35%'}
                                        size="xs"
                                        placeholder="2024/01/01 00:00"
                                        value={newDeadline.timestamp}
                                        onChange={(e) => {
                                            setNewDeadline({
                                                ...newDeadline,
                                                timestamp: e as Date,
                                            })
                                        }}
                                    />
                                    {newErrors.timestamp !== '' && (
                                        <Text>{newErrors.timestamp}</Text>
                                    )}
                                </Flex>
                                <Button type="button" onClick={addNewDeadline}>
                                    +
                                </Button>
                            </Flex>
                        </Stack>
                        <Button
                            type="submit"
                            // onClick={close}
                            w={'100%'}
                            radius="md"
                        >
                            submit
                        </Button>
                    </Flex>
                </form>
            </Modal>
            <div>
                <Button onClick={open} variant="filled">
                    New Event
                </Button>
            </div>
        </>
    )
}

export default NewEventModal

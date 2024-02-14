import {
    Button,
    Combobox,
    Divider,
    Flex,
    Input,
    InputBase,
    Modal,
    Stack,
    Text,
    TextInput,
    useCombobox,
} from '@mantine/core'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { DateInput, DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { FormEvent, useEffect, useState } from 'react'
import supabase, { eventsAtom } from '../lib/state'
import { useAtom } from 'jotai'
import { dateToPosition, dateToWidth } from '../lib/utils'
import { z } from 'zod'

const NewEventModal = () => {
    const FormDataValidateScheama = z.object({
        title: z.string().min(3),
        type: z.enum(['funding', 'publication']),
        deadlines: z
            .object({
                name: z.string().min(3),
                timestamp: z.date().nullable(),
            })
            .array()
            .min(1),
    })
    const FormDataSheama = FormDataValidateScheama.extend({
        type: z.enum(['funding', 'publication']).nullable(),
    })

    type FromData = z.infer<typeof FormDataSheama>

    const [opend, { open, close }] = useDisclosure(false)
    const emptyForm = { title: '', type: null, deadlines: [] }
    const [formData, setFormData] = useState<FromData>(emptyForm as FromData)
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
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const types = ['funding', 'publication']
    const options = types.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ))
    const NewDeadlineValidateScheama = z.object({
        name: z.string().min(3),
        timestamp: z.date(),
    })
    const NewDeadlineScheama = NewDeadlineValidateScheama.extend({
        timestamp: z.date().nullable(),
    })
    const [newDeadline, setNewDeadline] = useState<
        z.infer<typeof NewDeadlineScheama>
    >({
        name: '',
        timestamp: null,
    })

    const addNewDeadline = () => {
        const parsedData = NewDeadlineValidateScheama.safeParse(newDeadline)
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
    const deleteNewDeadline = ({
        deadline,
    }: {
        deadline: { name: string; timestamp: Date | null }
    }) => {
        setFormData({
            ...formData,
            deadlines: formData.deadlines.filter((e) => e !== deadline),
        })
    }

    const insertSupabase = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let tempErrors = { title: '', type: '', deadlines: '' }
        const parsedData = FormDataValidateScheama.safeParse(formData)
        if (parsedData.success) {
            setErrors(tempErrors)
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

    useEffect(() => {
        console.log(formData.deadlines)
    }, [formData.deadlines])

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
                            />
                            <Combobox
                                store={combobox}
                                onOptionSubmit={(val) => {
                                    setFormData({ ...formData, type: val })
                                    combobox.closeDropdown()
                                }}
                            >
                                <Combobox.Target>
                                    <InputBase
                                        component="button"
                                        type="button"
                                        pointer
                                        rightSection={<Combobox.Chevron />}
                                        rightSectionPointerEvents="none"
                                        onClick={() =>
                                            combobox.toggleDropdown()
                                        }
                                    >
                                        {formData.type || (
                                            <Input.Placeholder>
                                                pick
                                            </Input.Placeholder>
                                        )}
                                    </InputBase>
                                </Combobox.Target>
                                <Combobox.Dropdown>
                                    <Combobox.Options>
                                        {options}
                                    </Combobox.Options>
                                </Combobox.Dropdown>
                            </Combobox>
                        </Flex>
                        <Stack w={'100%'}>
                            {formData.deadlines.map((deadline) => (
                                <Flex key={deadline.name} align={'center'}>
                                    <Flex w={'100%'} direction={'column'}>
                                        <Text>{deadline.name}</Text>
                                        <Text pb={6}>
                                            {deadline.timestamp?.toLocaleDateString()}
                                        </Text>
                                    </Flex>
                                    <Flex>
                                        <Button>edit</Button>
                                        <Button
                                            onClick={() => {
                                                deleteNewDeadline({ deadline })
                                            }}
                                        >
                                            del
                                        </Button>
                                    </Flex>
                                    <Divider />
                                </Flex>
                            ))}
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
                                </Flex>
                                <Button type="button" onClick={addNewDeadline}>
                                    +
                                </Button>
                            </Flex>
                        </Stack>
                        <Button
                            type="submit"
                            onClick={close}
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

import {
    Button,
    Combobox,
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
import { FormEvent, useState } from 'react'
import supabase, { eventsAtom } from '../lib/state'
import { useAtom } from 'jotai'
import { dateToPosition, dateToWidth } from '../lib/utils'
import { z } from 'zod'

const NewEventModal = () => {
    const FormDataScheama = z.object({
        title: z.string().min(3),
        type: z.enum(['funding', 'publication']).nullable(),
        deadlines: z
            .object({
                name: z.string().min(3),
                timestamp: z.date().nullable(),
            })
            .array(),
    })

    type FromData = z.infer<typeof FormDataScheama>

    const [opend, { open, close }] = useDisclosure(false)
    const emptyForm = { title: '', type: null, deadlines: [] }
    const [formData, setFormData] = useState<FromData>(emptyForm as FromData)
    const [events, setEvents] = useAtom(eventsAtom)
    const viewport = useViewportSize()
    const [errors, setErrors] = useState({
        title: '',
        startDate: '',
        endDate: '',
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
    const [newDeadline, setNewDeadline] = useState({
        name: '',
        timestamp: null,
    })

    const addNewDeadline = () => {
        setFormData({
            ...formData,
            deadlines: [...formData.deadlines, newDeadline],
        })
        setNewDeadline({
            name: '',
            timestamp: null,
        })
    }

    const insertSupabase = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let tempErrors = { title: '', startDate: '', endDate: '' }
        const parsedData = FormDataScheama.safeParse(formData)
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
            // const keys = ['title', 'startDate', 'endDate']
            // parsedData.error.issues.map((issue) => {
            //     keys.map((key) => {
            //         if (issue.path[0] === key) {
            //             tempErrors = { ...tempErrors, [key]: issue.message }
            //         }
            //     })
            // })
            // setErrors(tempErrors)
        }
    }

    return (
        <>
            <Modal title="New Event" opened={opend} onClose={close} centered>
                <form onSubmit={(e) => insertSupabase(e)}>
                    <Flex align="center" direction="column" w="100%" gap={16}>
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
                        <Stack>
                            {formData.deadlines.map((deadline) => (
                                <Flex key={deadline.name}>
                                    <Text>{deadline.name}</Text>{' '}
                                    <Text>
                                        {deadline.timestamp?.toLocaleDateString()}
                                    </Text>
                                </Flex>
                            ))}
                            <Flex>
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
                                <Flex direction={'column'}>
                                    <TextInput
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
                        <Button type="submit" onClick={close}>
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

import { Button, Flex, Modal, Stack, Text, TextInput } from '@mantine/core'
import '@mantine/dates/styles.css'
import { useDisclosure } from '@mantine/hooks'
import Deadline from './components/Deadline'
import DropdownSelect from './components/DropdownSelect'
import NewDeadline from './components/NewDeadline'
import { FormEvent, useEffect, useState } from 'react'
import * as supabase from '../../adapters/supabase'
import {
    DeadlineFormType,
    EventFormType,
    formDataSchema,
} from '../../types/zod'

const NewEventModal = ({
    closeModal,
    editEvent,
}: {
    closeModal: () => void
    editEvent?: EventFormType
}) => {
    const [opend, { open, close }] = useDisclosure(true)
    const [formData, setFormData] = useState<EventFormType>({
        title: '',
        type: null,
        deadlines: [],
    })
    const [errors, setErrors] = useState({
        title: '',
        type: '',
        deadlines: '',
    })
    const onNewDeadline = (newDeadline: DeadlineFormType) => {
        setFormData({
            ...formData,
            deadlines: [...formData.deadlines, newDeadline],
        })
    }
    const onDeadlineUpdated = (
        newDeadline: DeadlineFormType,
        index: number
    ) => {
        setFormData({
            ...formData,
            deadlines: [
                ...formData.deadlines.slice(0, index),
                newDeadline,
                ...formData.deadlines.slice(
                    index + 1,
                    formData.deadlines.length
                ),
            ],
        })
    }
    const onDeadlineDelete = (deadline: DeadlineFormType) => {
        setFormData({
            ...formData,
            deadlines: formData.deadlines.filter((e) => e !== deadline),
        })
    }
    const onDropdownUpdate = (option: string) => {
        //@ts-ignore
        setFormData({ ...formData, type: option })
    }
    const insertSupabase = async (
        e: FormEvent<HTMLFormElement>,
        formData: EventFormType
    ) => {
        e.preventDefault()
        let tempErrors = { title: '', type: '', deadlines: '' }
        const parsedData = formDataSchema.safeParse(formData)
        if (parsedData.success) {
            setErrors(tempErrors)
            //@ts-ignore
            const { data, error } = await supabase.createEvent(formData)
            if (error) {
                console.log(error)
            }
            close
            closeModal()
            return
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

    if (!!editEvent) {
        setFormData({
            title: editEvent.title,
            //@ts-ignore
            type: editEvent.type,
            deadlines: editEvent.deadlines,
        })
    }

    useEffect(() => {
        if (!opend) {
            closeModal()
        }
    }, [opend])

    return (
        <>
            <Modal
                title="New Event"
                opened={opend}
                onClose={close}
                centered
                radius={24}
            >
                <form
                    onSubmit={(e) => {
                        insertSupabase(e, formData)
                        close
                    }}
                >
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
                            <DropdownSelect onUpdate={onDropdownUpdate} />
                        </Flex>
                        {errors.type !== '' && <Text>{errors.type}</Text>}
                        <Stack w={'100%'}>
                            {formData.deadlines.map((deadline, i) => (
                                <Deadline
                                    key={deadline.name}
                                    deadline={deadline}
                                    onUpdate={onDeadlineUpdated}
                                    index={i}
                                    onDelete={onDeadlineDelete}
                                />
                            ))}
                            {errors.deadlines !== '' && (
                                <Text>{errors.deadlines}</Text>
                            )}
                            <NewDeadline onSave={onNewDeadline} />
                        </Stack>
                        <Button type="submit" w={'100%'} radius="md">
                            submit
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </>
    )
}

export default NewEventModal

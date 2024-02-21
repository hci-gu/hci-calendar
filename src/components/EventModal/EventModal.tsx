import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
} from '@mantine/core'
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
import { z } from 'zod'
import { EventType } from '../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const NewEventModal = ({
    closeModal,
    editEvent,
}: {
    closeModal: () => void
    editEvent?: EventType
}) => {
    const [opend, { open, close }] = useDisclosure(true)
    const [formData, setFormData] = useState<EventFormType>({
        title: editEvent?.title ?? '',
        //@ts-ignore
        type: editEvent?.type ?? null,
        deadlines: editEvent?.deadlines ?? [],
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

        const parsedData = formDataSchema
            .extend({
                type: z.enum(['🔴 funding', '🟢 publication'], {
                    invalid_type_error: 'Color is required',
                }),
            })
            .safeParse(formData)
        if (parsedData.success) {
            setErrors(tempErrors)
            if (!!editEvent) {
                const { data, error } = await supabase.updateEvent({
                    ...editEvent,
                    title: formData.title,
                    type: formData.type ?? '',
                    //@ts-ignore
                    deadlines: formData.deadlines,
                })
                if (error) {
                    console.log(error)
                }
                close
                closeModal()
                return
            }
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

    useEffect(() => {
        if (!opend) {
            closeModal()
        }
    }, [opend])

    return (
        <>
            <Modal
                withCloseButton={false}
                opened={opend}
                onClose={close}
                centered
                radius={24}
                size="25vw"
            >
                <form
                    onSubmit={(e) => {
                        insertSupabase(e, formData)
                        close
                    }}
                >
                    <Flex align="center" direction="column" w="100%" gap={16}>
                        <Group w="100%" align="center" justify="space-between">
                            <div></div>
                            {/* hate this just let me felx end the actionicon */}
                            <Text size="36px" fw={400} c="grey">
                                {!!editEvent ? 'Edit Event' : 'New Event'}
                            </Text>
                            <ActionIcon
                                variant="transparent"
                                size="xl"
                                radius="md"
                                aria-label="close modal"
                                onClick={close}
                            >
                                <FontAwesomeIcon color="black" icon={faXmark} />
                            </ActionIcon>
                        </Group>
                        <Flex align="flex-end" gap={16} w="100%">
                            <TextInput
                                w="65%"
                                size="xl"
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
                            <div style={{ width: '35%' }}>
                                <DropdownSelect // cant find a way to turn the selector box red if error
                                    onUpdate={onDropdownUpdate}
                                    selectedOption={formData.type}
                                />
                                {errors.type !== '' && (
                                    <Text c={'red'}>{errors.type}</Text>
                                )}
                            </div>
                        </Flex>
                        <Stack w={'100%'} pb="18px" align="center">
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
                                <Text c='red'>{errors.deadlines}</Text>
                            )}
                            <NewDeadline onSave={onNewDeadline} />
                        </Stack>
                        <Button type="submit" w={'100%'} radius="lg" size="xl">
                            Save
                        </Button>
                    </Flex>
                </form>
            </Modal>
        </>
    )
}

export default NewEventModal

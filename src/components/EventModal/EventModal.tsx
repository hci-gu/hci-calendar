import {
    ActionIcon,
    Button,
    Flex,
    Grid,
    Group,
    Modal,
    SimpleGrid,
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
import {
    DeadlineFormType,
    EventFormType,
    EventTypeType,
    formDataSchema,
} from '../../types/zod'
import { EventType } from '../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import * as pocketbase from '../../adapters/pocketbase'

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
        type: editEvent?.type ?? 'Funding',
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
    const onDropdownUpdate = (option: EventTypeType) => {
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
            if (!!editEvent) {
                const data = pocketbase.updateEvent({
                    ...editEvent,
                    title: formData.title,
                    type: formData.type,
                    deadlines: formData.deadlines,
                })
                close
                closeModal()
                return
            }
            const data = pocketbase.createEvent({
                title: formData.title,
                type: formData.type,
                deadlines: formData.deadlines,
            })
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

    const deleteCurrentEvent = () => {
        if (!editEvent) {
            return
        }
        pocketbase.deleteEvent(editEvent)
        closeModal()
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
                size="780px"
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
                        <Grid align='end' w="100%">
                            <Grid.Col span={8}>
                                <TextInput
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
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <DropdownSelect // cant find a way to turn the selector box red if error
                                    onUpdate={(option) =>
                                        onDropdownUpdate(
                                            option as EventTypeType
                                        )
                                    }
                                    selectedOption={formData.type}
                                    labelName='Type'
                                />
                                {errors.type !== '' && (
                                    <Text c={'red'}>{errors.type}</Text>
                                )}
                            </Grid.Col>
                        </Grid>
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
                                <Text c="red">{errors.deadlines}</Text>
                            )}
                            <NewDeadline onSave={onNewDeadline} />
                        </Stack>
                        <Flex w="100%" gap={24}>
                            <Button
                                type="submit"
                                w={'100%'}
                                radius="lg"
                                size="xl"
                            >
                                Save
                            </Button>
                            {!!editEvent && (
                                <Button
                                    type="button"
                                    radius="lg"
                                    size="xl"
                                    variant="outline"
                                    w="27%"
                                    onClick={() => {
                                        deleteCurrentEvent()
                                        close
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                </form>
            </Modal>
        </>
    )
}

export default NewEventModal

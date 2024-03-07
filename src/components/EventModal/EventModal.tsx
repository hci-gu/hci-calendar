import {
    ActionIcon,
    Button,
    Combobox,
    Flex,
    Grid,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
} from '@mantine/core'
import '@mantine/dates/styles.css'
import { useDisclosure } from '@mantine/hooks'
import Deadline from './components/Deadline'
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
import DropdownSelect from './components/DropdownSelect'
import { getColor } from '../../lib/utils'

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
                    title: parsedData.data.title,
                    type: parsedData.data.type,
                    deadlines: parsedData.data.deadlines,
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

    const optionTypeValues = Object.values(EventTypeType.Values)

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
                        <Grid align="end" w="100%">
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
                                    error={
                                        errors.title !== '' ? errors.title : ''
                                    }
                                />
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <DropdownSelect
                                    selectedOption={formData.type}
                                    onUpdate={(option) =>
                                        onDropdownUpdate(
                                            option as EventTypeType
                                        )
                                    }
                                    labelName="Type"
                                >
                                    <Combobox.Options>
                                        {optionTypeValues.map((item) => {
                                            return (
                                                <Combobox.Option
                                                    value={item}
                                                    key={item}
                                                >
                                                    <Flex
                                                        align="center"
                                                        gap="sm"
                                                    >
                                                        <div
                                                            style={{
                                                                contain: '',
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                borderRadius:
                                                                    '50%',
                                                                backgroundColor: `var(--mantine-color-${getColor(item)}-4)`,
                                                            }}
                                                        ></div>
                                                        <Text>{item}</Text>
                                                    </Flex>
                                                </Combobox.Option>
                                            )
                                        })}
                                    </Combobox.Options>
                                </DropdownSelect>
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

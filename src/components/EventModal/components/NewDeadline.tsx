import { ActionIcon, Divider, Flex, Text, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useState } from 'react'
import { DeadlineFormType, IconType, deadlineSchema, formDataSchema } from '../../../types/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFloppyDisk,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons'
import DropdownIcon from './DropdownIcon'

const NewDeadline = ({
    deadline,
    onSave,
    onCancel,
}: {
    deadline?: DeadlineFormType
    onSave: (deadline: DeadlineFormType) => void
    onCancel?: () => void
}) => {
    const [newErrors, setNewErrors] = useState({
        name: '',
        timestamp: '',
    })
    const [newDeadline, setNewDeadline] = useState<
        DeadlineFormType
    >({
        name: deadline ? deadline.name : '',
        timestamp: deadline?.timestamp as Date,
        icon: deadline?.icon as IconType,
    })

    const addNewDeadline = () => {
        const parsedData = deadlineSchema.safeParse(newDeadline)
        let tempErrors = { name: '', timestamp: '' }
        if (parsedData.success) {
            setNewErrors(tempErrors)
            onSave(newDeadline)
            setNewDeadline({
                name: '',
                timestamp: null,
                icon: 'Bell Icon',
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

    const onDropdownUpdate = (option: IconType) => {
        setNewDeadline({ ...newDeadline, icon: option })
    }

    return (
        <Flex w="100%" direction="column">
            <Flex align={'center'} w={'100%'}>
                <Flex direction={'column'} gap={6} w={'100%'}>
                    <TextInput
                        size="lg"
                        w="310px"
                        placeholder="Deadline Name"
                        value={newDeadline.name}
                        onChange={(e) => {
                            setNewDeadline({
                                ...newDeadline,
                                name: e.target.value,
                            })
                        }}
                        error={newErrors.name !== '' ? newErrors.name : ''}
                    />
                    <DateTimePicker
                        w="310px"
                        size="md"
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
                        <Text c="red">{newErrors.timestamp}</Text>
                    )}
                    <DropdownIcon selectedOption={newDeadline.icon} onUpdate={(option) => onDropdownUpdate(option as IconType)} />
                </Flex>
                {!!deadline ? (
                    <>
                        <Flex gap={16}>
                            <ActionIcon
                                variant="outline"
                                size="xl"
                                radius="md"
                                aria-label="cancels the editing of the deadline"
                                onClick={() => {
                                    if (onCancel) {
                                        onCancel()
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </ActionIcon>
                            <ActionIcon
                                variant="outline"
                                size="xl"
                                radius="md"
                                aria-label="saves the edited deadline"
                                onClick={addNewDeadline}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} />
                            </ActionIcon>
                        </Flex>
                    </>
                ) : (
                    <ActionIcon
                        variant="filled"
                        size="xl"
                        radius="md"
                        aria-label="adds a new deadline"
                        onClick={addNewDeadline}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </ActionIcon>
                )}
            </Flex>
            <Divider mt={8} />
        </Flex>
    )
}

export default NewDeadline

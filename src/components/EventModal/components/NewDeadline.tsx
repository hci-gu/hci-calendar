import { ActionIcon, Combobox, Divider, Flex, SimpleGrid, Text, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useState } from 'react'
import { DeadlineFormType, IconType, deadlineSchema } from '../../../types/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFloppyDisk,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons'
import DropdownSelect from './DropdownSelect'
import { getIcon } from '../../../lib/utils'

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

    const optionIconsValues = Object.values(IconType.Values)

    return (
        <Flex w="100%" direction="column">
            <Flex align={'center'} justify="space-between" w={'100%'}>
                <SimpleGrid cols={2} spacing="sm">
                    <TextInput
                        size="lg"
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
                    <DropdownSelect selectedOption={newDeadline.icon} onUpdate={(option) => onDropdownUpdate(option as IconType)}>
                        <Combobox.Options>
                            {optionIconsValues.map((item) => {
                                return (
                                    <Combobox.Option value={item} key={item}>
                                        <Flex align="center" gap="sm">
                                            <FontAwesomeIcon color='var(--mantine-primary-color-filled)' icon={getIcon(item)} />
                                            <Text>{item}</Text>
                                        </Flex>
                                    </Combobox.Option>
                                )
                            })}
                        </Combobox.Options>
                    </DropdownSelect>
                    <DateTimePicker
                        size="lg"
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
                </SimpleGrid>
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

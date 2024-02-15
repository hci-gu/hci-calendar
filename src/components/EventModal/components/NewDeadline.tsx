import { Button, Flex, Text, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { NewDeadlineValidateschema, NewDeadlineschema } from '../schemas'
import { useState } from 'react'
import { z } from 'zod'
import { DeadlineType } from '../state'

const NewDeadline = ({
    deadline,
    onSave,
    onCancel,
}: {
    deadline?: DeadlineType
    onSave: (deadline: DeadlineType) => void
    onCancel?: () => void
}) => {
    const [newErrors, setNewErrors] = useState({
        name: '',
        timestamp: '',
    })
    const [newDeadline, setNewDeadline] = useState<
        z.infer<typeof NewDeadlineschema>
    >({
        name: deadline ? deadline.name : '',
        timestamp: deadline?.timestamp as Date,
    })

    const addNewDeadline = () => {
        const parsedData = NewDeadlineValidateschema.safeParse(newDeadline)
        let tempErrors = { name: '', timestamp: '' }
        if (parsedData.success) {
            setNewErrors(tempErrors)
            onSave(newDeadline)
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

    return (
        <Flex align={'center'} w={'100%'}>
            <Flex direction={'column'} gap={6} w={'100%'}>
                <TextInput
                    size="sm"
                    // w={'45%'}
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
                    // w={'38%'}
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
            {!!deadline ? (
                <>
                    <Flex>
                        <Button type="button" onClick={addNewDeadline}>
                            save
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel()
                                }
                            }}
                        >
                            cancel
                        </Button>
                    </Flex>
                </>
            ) : (
                <Button type="button" onClick={addNewDeadline}>
                    +
                </Button>
            )}
        </Flex>
    )
}

export default NewDeadline

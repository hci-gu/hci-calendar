import { Button, Divider, Flex, Text } from '@mantine/core'
import NewDeadline from './NewDeadline'
import { useState } from 'react'
import { DeadlineFormType } from '@/src/types/zod'

const Deadline = ({
    deadline,
    onUpdate,
    index,
    onDelete,
}: {
    deadline: DeadlineFormType
    onUpdate: (deadline: DeadlineFormType, index: number) => void
    index: number
    onDelete: (deadline: DeadlineFormType) => void
}) => {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <NewDeadline
                deadline={deadline}
                onSave={(updatedDeadline) => {
                    onUpdate(updatedDeadline, index)
                    setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
            />
        )
    }

    return (
        <>
            <Flex key={deadline.name} align={'center'}>
                <Flex w={'100%'} direction={'column'}>
                    <Text>{deadline.name}</Text>
                    <Text pb={6}>
                        {deadline.timestamp?.toLocaleDateString()}
                    </Text>
                </Flex>
                <Flex>
                    <Button
                        onClick={() => {
                            setIsEditing(true)
                        }}
                    >
                        edit
                    </Button>
                    <Button
                        onClick={() => {
                            onDelete(deadline)
                        }}
                    >
                        del
                    </Button>
                </Flex>
                <Divider />
            </Flex>
        </>
    )
}

export default Deadline

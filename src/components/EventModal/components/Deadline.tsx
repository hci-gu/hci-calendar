import { Button, Divider, Flex, Text } from '@mantine/core'
import { DeadlineType, formDataAtom, isEditingAtom } from '../state'
import { useAtom } from 'jotai'
import NewDeadline from './NewDeadline'
import { useState } from 'react'

const Deadline = ({
    deadline,
    onUpdate,
    index,
}: {
    deadline: { name: string; timestamp: Date | null }
    onUpdate: (deadline: DeadlineType, index: number) => void
    index: number
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useAtom(formDataAtom)

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

    if (isEditing) {
        //@ts-ignore
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
                            deleteNewDeadline({ deadline })
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

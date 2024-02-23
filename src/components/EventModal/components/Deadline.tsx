import { ActionIcon, Divider, Flex, Text } from '@mantine/core'
import NewDeadline from './NewDeadline'
import { useState } from 'react'
import { DeadlineFormType } from '@/src/types/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEditingAtom } from '../EventModal'
import { useSetAtom } from 'jotai'

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
    const setIsEditingAtom = useSetAtom(isEditingAtom)

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
            <Flex
                key={deadline.name}
                align={'center'}
                justify={'Center'}
                direction="column"
                h={107}
                w="100%"
            >
                <Flex w="100%" align={'center'} h="100%">
                    <Flex w={'100%'} direction={'column'} gap={8}>
                        <Text size="24px" fw={700}>
                            {deadline.name}
                        </Text>
                        <Text pb={6} size="18px" fw={300} c="grey">
                            {deadline.timestamp?.toLocaleDateString()}
                        </Text>
                    </Flex>
                    <Flex gap={16}>
                        <ActionIcon
                            variant="outline"
                            size="xl"
                            radius="md"
                            aria-label="edit deadline"
                            onClick={() => {
                                setIsEditing(true)
                                setIsEditingAtom(true)
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </ActionIcon>
                        <ActionIcon
                            variant="outline"
                            size="xl"
                            radius="md"
                            aria-label="remove deadline"
                            color="red"
                            onClick={() => {
                                onDelete(deadline)
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </ActionIcon>
                    </Flex>
                </Flex>
                <Divider size="xs" variant="solid" w="100%" mt="12px" />
            </Flex>
        </>
    )
}

export default Deadline

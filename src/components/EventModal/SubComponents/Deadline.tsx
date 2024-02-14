import { Button, Divider, Flex, Text } from '@mantine/core'
import { formDataAtom } from '../state'
import { useAtom } from 'jotai'

const Deadline = ({
    deadline,
}: {
    deadline: { name: string; timestamp: Date | null }
}) => {
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
                    <Button>edit</Button>
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

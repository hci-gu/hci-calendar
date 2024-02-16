import { deadlinesType } from '@/src/types/zod'
import { Divider, Flex, MantineStyleProp, Text } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import moment from 'moment'

type DeadlineProps = {
    deadline: deadlinesType
    isFirst: boolean
    flex: number
}

const absolutePos: MantineStyleProp = {
    position: 'absolute',
    top: 0,
    left: -100,
}

const Deadline = ({ deadline, isFirst, flex }: DeadlineProps) => {
    const timeFromNow = moment(deadline.timestamp).fromNow()

    return (
        <Flex
            bg={!isFirst ? 'HCI-Green.4' : ''}
            flex={flex}
            justify="end"
            style={isFirst ? absolutePos : {}}
        >
            <Flex direction="column" align="end" py="lg" px="md">
                <Text c={'HCI-Green.8'} fw="bold">
                    <IconBell />
                    {` ${deadline.name}`}
                </Text>
                <Text c={'HCI-Green.8'} fw="bold">
                    {moment(deadline.timestamp).format('MM/DD')}
                </Text>
                <Text c={'HCI-Green.8'} fw="bold">
                    {timeFromNow}
                </Text>
            </Flex>

            <Divider
                color="HCI-Green.8"
                ml="xs"
                size="xl"
                orientation="vertical"
            />
        </Flex>
    )
}

export default Deadline

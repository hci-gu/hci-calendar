import { Flex, Title } from '@mantine/core'
import { EventAtom } from '../../types/types'
import { deadlinesType, deadlinesZod } from '../../types/zod'
import moment from 'moment'
import Deadline from './Deadline'

const DeadLines = ({ deadlines }: { deadlines: deadlinesType[] }) => {
    return (
        <Flex pos="relative">
            {deadlines.map((deadline, index) => (
                <Deadline
                    deadline={deadline}
                    isFirst={index == 0}
                    flex={
                        index == 0
                            ? 0
                            : moment(deadline.timestamp).diff(
                                  deadlines[index - 1].timestamp,
                                  'days'
                              )
                    }
                />
            ))}
        </Flex>
    )
}

const EventCard = ({ event }: { event: EventAtom }) => {
    const deadlines = deadlinesZod.array().parse(event.deadlines)

    return (
        <Flex direction="column" justify="end" gap="sm">
            <Title c={'HCI-Green.8'} order={2}>
                {event.title}
            </Title>
            <DeadLines deadlines={deadlines} />
        </Flex>
    )
}

export default EventCard

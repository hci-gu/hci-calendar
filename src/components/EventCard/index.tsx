import { Flex, Title } from '@mantine/core'
import { EventAtom } from '../../types/types'
import { deadlinesZod } from '../../types/zod'
import Deadline from './deadline';

const EventCard = ({ event }: { event: EventAtom }) => {
    const deadlines = deadlinesZod.array().parse(event.deadlines);

    return (
        <Flex direction="column" justify="end" gap="sm">
            <Title c={'HCI-Green.8'} order={2}>
                {event.title}
            </Title>
            <Flex align="end" direction="row">
                {deadlines.map((deadline, index) => (
                    <Deadline key={deadline.timestamp} deadline={deadline} isFirst={index === 0} />
                ))}
            </Flex>
        </Flex>
    )
}

export default EventCard

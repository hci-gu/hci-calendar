import { Flex, Title } from '@mantine/core'
import { EventAtom } from '../../types/types'
import { deadlinesZod } from '../../types/zod'
import Deadline from './deadline'

const EventCard = ({ event }: { event: EventAtom }) => {
    const deadlines = deadlinesZod.array().parse(event.deadlines)

    const data = {
        pos: event.position,
        dates: (event.deadlines as any).map((d: any) => d.timestamp),
    }

    return (
        <div style={{ border: '1px dotted red' }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )

    return (
        <Flex direction="column" justify="end" gap="sm">
            <Title c={'HCI-Green.8'} order={2}>
                {event.title}
            </Title>
            <Flex align="end" direction="row">
                {deadlines.map((deadline, index) => (
                    <Deadline
                        key={deadline.timestamp}
                        deadline={deadline}
                        isFirst={index === 0}
                    />
                ))}
            </Flex>
        </Flex>
    )
}

export default EventCard

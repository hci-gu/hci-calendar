import { Card, Flex, Text } from '@mantine/core'
import { positionToDate } from '../lib/utils'
import { EventAtom } from '../types/types'
import { useViewportSize } from '@mantine/hooks'

const EventCard = ({ event }: { event: EventAtom }) => {
    const viewport = useViewportSize()
    return (
        <Card shadow="sm" withBorder style={{ height: '100%' }} radius="md">
            <Card.Section p={4} withBorder bg="orange">
                <Flex justify="space-between">
                    <Text size="xs" fw="bold">
                        {positionToDate(
                            event.position.x,
                            viewport.width
                        ).format('MMM DD')}
                    </Text>
                    <Text size="xs" fw="bold">
                        {positionToDate(
                            event.position.x + event.size.width,
                            viewport.width
                        ).format('MMM DD')}
                    </Text>
                </Flex>
            </Card.Section>
            <Card.Section p={8} withBorder bg="red">
                <Text size="sm">{event.title}</Text>
            </Card.Section>
        </Card>
    )
}

export default EventCard

import { Card, Flex, Paper, Text, Title } from '@mantine/core'
import { EventAtom } from '../types/types'
import { deadlinesZod } from '../types/zod'
import { IconAdjustments, IconBell, IconFolder } from '@tabler/icons-react';
import moment from 'moment';

const EventCard = ({ event }: { event: EventAtom }) => {
    const deadlines = deadlinesZod.array().parse(event.deadlines);

    return (
        <Paper shadow="sm" radius="md">
            <Flex direction="column" justify="end" gap="sm">
                <Title c={'HCI-Green.8'} order={2}>
                    {event.title}
                </Title>
                <Flex align="end" direction="column" bg='HCI-Green.4' p="sm" >

                    <Flex>
                        <Text c={'HCI-Green.8'}>
                            <IconBell />
                            {deadlines[0].name}
                        </Text>
                        <Text c={'HCI-Green.8'}>
                            {moment(deadlines[0].timestamp).format('D/M')}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Paper>
    )
}

export default EventCard

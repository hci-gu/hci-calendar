import { Divider, Flex, Title } from '@mantine/core'
import moment from 'moment'
import { EventType } from '../../types/types'
import DeadlineText from './DeadlineText'


const EventCard = ({ event, width }: { event: EventType, width: number }) => (
    <Flex
        w={width}
        h="130px"
        direction="column"
        align="flex-end"
        gap="xs"
    >
        <Title order={2} c={'HCI-Green.8'}>{event.title}</Title>
        <Flex
            w="100%"
            h="100%"
            pos="relative"
        >
            {/* Events after first event */}
            {event.deadlines
                .slice(1, event.deadlines.length)
                .map((deadline, index) => {
                    const flexWidth = moment(deadline.timestamp)
                        .diff(event.deadlines[index].timestamp, 'days')
                    // console.log(deadline);


                    return (
                        <Flex
                            h="100%"
                            bg='HCI-Green.4'
                            justify="flex-end"
                            style={{
                                overflow: 'clip',
                            }}
                            key={(event.id + deadline.name) as string}
                            flex={flexWidth}
                        >
                            <DeadlineText event={deadline} />
                            <Divider orientation="vertical" size="xl" color="HCI-Green.8" />
                        </Flex>)
                }
                )
            }
            {/* First Event Content */}
            <Flex
                h="100%"
                justify="flex-end"
                pos="absolute"
                top={0}
                right={(width ?? 0) - 10}
            >
                <DeadlineText event={event.deadlines[0]} />
                <Divider orientation="vertical" size="xl" color="HCI-Green.8" />
            </Flex>
        </Flex>
    </Flex>
)

export default EventCard

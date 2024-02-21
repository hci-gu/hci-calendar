import { Divider, Flex, Title } from '@mantine/core'
import moment from 'moment'
import { EventType } from '../../types/types'
import DeadlineText from './DeadlineText'
import { colorType } from '@/src/lib/mantineConfig'

const EventCard = ({ event, width, color }: { event: EventType, width: number, color: colorType }) => {    
    return (
        <Flex
            w={width}
            h="157px"
            direction="column"
            align="flex-end"
            gap="xs"
        >
            <Title order={2} c={color+".8"}>{event.title}</Title>
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


                        return (
                            <Flex
                                h="100%"
                                bg={color+".4"}
                                justify="flex-end"
                                style={{
                                    overflow: 'clip',
                                }}
                                key={(event.id + deadline.name) as string}
                                flex={flexWidth}
                            >
                                <DeadlineText event={deadline} color={color} />
                                <Divider orientation="vertical" size="xl" color={color+".8"} />
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
                    <DeadlineText event={event.deadlines[0]} color={color} />
                    <Divider orientation="vertical" size="xl" color={color+".8"} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default EventCard

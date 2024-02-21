import { Divider, Flex, Title } from '@mantine/core'
import moment from 'moment'
import { EventType } from '../../types/types'
import DeadlineText from './DeadlineText'
import { colorType } from '@/src/lib/mantineConfig'
import { useState } from 'react'
import NewEventModal from '../EventModal/EventModal'

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
                />
            ))}
        </Flex>
    )
}

const EventCard = ({ event, width }: { event: EventType; width: number }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const closeModal = () => {
        setModalOpen(false)
    }
    return (
        <>
            <Flex
                direction="column"
                justify="end"
                gap="sm"
                w={width}
                onClick={() => setModalOpen(true)}
            >
                <Title c={'HCI-Green.8'} order={2}>
                    {event.title}
                </Title>
                <DeadLines deadlines={event.deadlines} eventId={event.id} />
            </Flex>
            {!!modalOpen && (
                <NewEventModal closeModal={closeModal} editEvent={event} />
            )}
        </>
    )
}

export default EventCard

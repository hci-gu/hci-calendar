import { Flex, Title } from '@mantine/core'
import moment from 'moment'
import { DeadlineType, EventType } from '../../types/types'
import Deadline from './Deadline'
import { useState } from 'react'
import NewEventModal from '../EventModal/EventModal'

const DeadLines = ({
    deadlines,
    eventId,
}: {
    deadlines: DeadlineType[]
    eventId: number
}) => {
    return (
        <Flex pos="relative">
            {deadlines.map((deadline, index) => (
                <Deadline
                    key={`Deadline_${eventId}_${deadline.timestamp}`}
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

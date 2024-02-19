import React from 'react'
import { Rnd } from 'react-rnd'
import { useEvents } from '../lib/state'
import EventCard from './EventCard'
import { positionAndWidthForDates } from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { Divider, Flex, Text } from '@mantine/core'
import moment from 'moment'

const Events = () => {
    const viewport = useViewportSize()
    const events = useEvents()

    return (
        <>
            {events.map((event, i) => {
                const [x, width] = positionAndWidthForDates(
                    event.deadlines.map((d) => d.timestamp),
                    viewport.width
                )

                const eventWidth = i !== 0 ? width : undefined

                return (
                    <Rnd
                        key={event.id}
                        position={{
                            x,
                            y: 100 + 200 * i,
                        }}
                        disableDragging
                        enableResizing={false}
                        bounds="window"
                    >
                        {/* <EventCard event={event} width={eventWidth} /> */}
                        <Flex
                            w={eventWidth}
                            h="180px"
                            direction="column"
                            align="flex-end"
                            style={{ border: '1px solid red' }}
                        >
                            <Text>asdasd</Text>
                            <Flex
                                w="100%"
                                h="100%"
                                pos="relative"
                                style={{ border: '1px solid blue' }}
                            >
                                {event.deadlines
                                    .slice(1, event.deadlines.length)
                                    .map((d, index) => (
                                        <Flex
                                            h="100%"
                                            justify="flex-end"
                                            style={{
                                                background: 'green',
                                            }}
                                            key={(event.id + d.name) as string}
                                            flex={moment(d.timestamp).diff(
                                                event.deadlines[index]
                                                    .timestamp,
                                                'days'
                                            )}
                                        >
                                            <Divider
                                                orientation="vertical"
                                                size="xl"
                                            />
                                        </Flex>
                                    ))}
                            </Flex>
                        </Flex>
                    </Rnd>
                )
            })}
        </>
    )
}

export default Events

import React from 'react'
import { Rnd } from 'react-rnd'
import { useEvents } from '../lib/state'
import EventCard from './EventCard'
import { positionAndWidthForDates } from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { Divider, Flex, Stack, Text, Title } from '@mantine/core'
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

                const eventWidth = i !== 0 ? width : 0

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
                            <Title order={2}>{event.title}</Title>
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
                                                overflow: 'clip',
                                            }}
                                            key={(event.id + d.name) as string}
                                            flex={moment(d.timestamp).diff(
                                                event.deadlines[index]
                                                    .timestamp,
                                                'days'
                                            )}
                                        >
                                            <Stack
                                                h="100%"
                                                align="flex-end"
                                                justify="space-around"
                                            >
                                                <Text
                                                    style={{
                                                        textWrap: 'nowrap',
                                                    }}
                                                >
                                                    {d.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        textWrap: 'nowrap',
                                                    }}
                                                >
                                                    {d.timestamp.toDateString()}
                                                </Text>
                                            </Stack>
                                            <Divider
                                                orientation="vertical"
                                                size="xl"
                                            />
                                        </Flex>
                                    ))}
                                <Flex
                                    style={{ border: '1px solid yellow' }}
                                    pos="absolute"
                                    top={0}
                                    right={eventWidth - 10}
                                    h="100%"
                                    justify="flex-end"
                                >
                                    <Stack
                                        h="100%"
                                        align="flex-end"
                                        justify="space-around"
                                    >
                                        <Text style={{ textWrap: 'nowrap' }}>
                                            {event.deadlines[0].name}
                                        </Text>
                                        <Text style={{ textWrap: 'nowrap' }}>
                                            {event.deadlines[0].timestamp.toDateString()}
                                        </Text>
                                    </Stack>
                                    <Divider orientation="vertical" size="xl" />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Rnd>
                )
            })}
        </>
    )
}

export default Events

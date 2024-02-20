import React from 'react'
import { Rnd } from 'react-rnd'
import { useEvents } from '../lib/state'
import EventCard from './EventCard'
import { positionAndWidthForDates } from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { Divider, Flex, Stack, Text, Title } from '@mantine/core'
import moment from 'moment'
import { IconBell } from '@tabler/icons-react'

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
                                {event.deadlines
                                    .slice(1, event.deadlines.length)
                                    .map((d, index) => (
                                        <Flex
                                            h="100%"
                                            bg='HCI-Green.4'
                                            justify="flex-end"
                                            style={{
                                                // background: 'green',
                                                overflow: 'clip',
                                            }}
                                            key={(event.id + d.name) as string}
                                            flex={moment(d.timestamp).diff(
                                                event.deadlines[index]
                                                    .timestamp,
                                                'days'
                                            )}
                                        >
                                            <Flex
                                                h="100%"
                                                align="flex-end"
                                                direction="column"
                                                p="md"
                                            >
                                                <Text c={'HCI-Green.8'} fw="bold" style={{ textWrap: 'nowrap' }}>
                                                    <IconBell />
                                                    {` ${d.name}`}
                                                </Text>
                                                <Text c={'HCI-Green.8'} fw="bold" style={{ textWrap: 'nowrap' }}>
                                                    {moment(d.timestamp).format('MM/DD')}
                                                </Text>
                                                {/* <Text c={'HCI-Green.8'} fw="bold">
                                                    {moment(d.timestamp).fromNow()}
                                                </Text> */}
                                            </Flex>
                                            <Divider
                                                orientation="vertical"
                                                size="xl"
                                                color="HCI-Green.8"
                                            />
                                        </Flex>
                                    ))}
                                <Flex
                                    pos="absolute"
                                    top={0}
                                    right={eventWidth - 10}
                                    h="100%"
                                    justify="flex-end"
                                >
                                    <Flex
                                        h="100%"
                                        align="flex-end"
                                        direction="column"
                                        p="md"
                                    >
                                        <Text style={{ textWrap: 'nowrap' }} fw="bold" c={'HCI-Green.8'}>
                                            <IconBell />
                                            {` ${event.deadlines[0].name}`}
                                        </Text>
                                        <Text style={{ textWrap: 'nowrap' }} fw="bold" c={'HCI-Green.8'}>
                                            {moment(event.deadlines[0].timestamp).format('MM/DD')}
                                        </Text>

                                        {/* <Text c={'HCI-Green.8'} fw="bold">
                                            <IconBell />
                                            {` ${d.name}`}
                                        </Text>
                                        <Text c={'HCI-Green.8'} fw="bold">
                                            {moment(d.timestamp).format('MM/DD')}
                                        </Text> */}
                                    </Flex>
                                    <Divider orientation="vertical" size="xl" color="HCI-Green.8" />
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

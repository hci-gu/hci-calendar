import styled from '@emotion/styled'
import { ActionIcon, Button, Flex, SimpleGrid, Text } from '@mantine/core'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewEventModal from './EventModal/EventModal'
import { EventType } from '../types/types'
import { useViewportSize } from '@mantine/hooks'
import { dayWidth } from '../lib/utils'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled.div`
    height: 90px;

    display: flex;
    flex-direction: column;
`

const MonthContainer = styled.div`
    /* width: 100%; */
    /* height: 57px; */
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 0;
    border-top: 0;
    padding-top: 8px;
    padding-left: 8px;

    /* position: relative; */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    /* justify-content: space-between; */
    /* align-items: space-between; */

    /* > div {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        padding: 4px 0;
    } */
`

const DayContainer = styled.div`
    position: relative;

    width: 0.5px;
    height: 3px;

    background-color: rgba(0, 0, 0, 0.25);
`

const DayTick = ({ month, day }: { month: string; day: number }) => {
    const isToday = moment().format('MMMM') === month && moment().date() === day

    return (
        <DayContainer>
            {isToday && (
                <Text
                    size="xs"
                    fw="bold"
                    style={{
                        position: 'absolute',
                        top: '-16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    {day}
                </Text>
            )}
        </DayContainer>
    )
}

const Month = ({ monthIndex }: { monthIndex: number }) => {
    const date = moment().add(monthIndex, 'months')
    const isCurrentMonth = moment().month() === date.month()
    const isFirstMonth = date.month() === 0
    const year = moment(date).year()
    const firstDayOfMonth = moment().add(monthIndex, 'month').startOf('month')
    const lastDayOfMonth = moment().add(monthIndex, 'month').endOf('month')
    const daysInMonth = moment(lastDayOfMonth).diff(
        moment(firstDayOfMonth),
        'days'
    ) + 1
    const viewport = useViewportSize()
    const monthWidth = dayWidth(viewport.width) * daysInMonth
    


    return (
        <MonthContainer style={{ width: `${monthWidth}px` }}>
            {isFirstMonth && <Text fw="bold">{year}</Text>}
            <Text
                fw={isCurrentMonth ? 600 : 400}
                c={isCurrentMonth ? 'red' : 'black'}
            >
                {date.format('MMMM')}
            </Text>
        </MonthContainer>
    )
}

const Header = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const closeModal = () => {
        setModalOpen(false)
    }

    return (
        <>
            <Flex direction="column">
                <ActionIcon
                    pos="absolute"
                    bottom={100}
                    right={100}
                    variant="outline"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                    size={50}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </ActionIcon>
                {!!modalOpen && <NewEventModal closeModal={closeModal} />}
                <Flex>
                    {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                        (monthIndex) => (
                            <Month
                                key={`Month_${monthIndex}`}
                                monthIndex={monthIndex}
                            />
                        )
                    )}
                </Flex>
            </Flex>
        </>
    )
}

export default Header

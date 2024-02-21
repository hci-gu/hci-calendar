import styled from '@emotion/styled'
import { ActionIcon, Button, Flex, SimpleGrid, Text } from '@mantine/core'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewEventModal from './EventModal/EventModal'
import { EventType } from '../types/types'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled.div`
    height: 90px;

    display: flex;
    flex-direction: column;
`

const MonthContainer = styled.div`
    width: 100%;
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
    // const days = moment(month, 'MMMM').daysInMonth()
    const isCurrentMonth = moment().month() === date.month()
    const isFirstMonth = date.month() === 0
    const year = moment(date).year()

    return (
        <MonthContainer>
            {isFirstMonth && <Text fw="bold">{year}</Text>}
            <Text
                fw={isCurrentMonth ? 600 : 400}
                c={isCurrentMonth ? 'red' : 'black'}
            >
                {date.format('MMMM')}
            </Text>
            {/* <Flex justify="space-evenly" align="stretch">
                {Array(days)
                    .fill(days)
                    .map((_, i) => (
                        <DayTick key={`${month}_${i}`} month={month} day={i} />
                    ))}
            </Flex> */}
        </MonthContainer>
    )
}

const Header = () => {
    return (
        <>
            <Flex direction="column">
                <SimpleGrid cols={12}>
                    {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                        (monthIndex) => (
                            <Month
                                key={`Month_${monthIndex}`}
                                monthIndex={monthIndex}
                            />
                        )
                    )}
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default Header

import styled from '@emotion/styled'
import { Button, Flex, Text } from '@mantine/core'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewEventModal from './EventModal/EventModal'

const Container = styled.div`
    height: 90px;

    display: flex;
    flex-direction: column;
`

const MonthContainer = styled.div`
    width: 100%;
    height: 57px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 0;
    border-top: 0;

    /* position: relative; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* align-items: space-between; */

    > div {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        padding: 4px 0;
    }
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

const Month = ({ month }: { month: string }) => {
    const days = moment(month, 'MMMM').daysInMonth()
    const isCurrentMonth = moment().format('MMMM') === month

    return (
        <MonthContainer>
            <Text
                p={8}
                fw={isCurrentMonth ? 600 : 400}
                c={isCurrentMonth ? 'red' : 'black'}
            >
                {month}
            </Text>
            <Flex justify="space-evenly" align="stretch">
                {Array(days)
                    .fill(days)
                    .map((_, i) => (
                        <DayTick key={`${month}_${i}`} month={month} day={i} />
                    ))}
            </Flex>
        </MonthContainer>
    )
}

const Header = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const currentYear = moment().year()
    const months = moment.months()
    console.log(months)

    const prevMonth = moment().subtract(1, 'months').startOf('month').toDate()

    const lastMonth = moment().add(11, 'months').endOf('month').toDate()

    const days = moment(lastMonth).diff(moment(prevMonth), 'days')

    console.log({ prevMonth: prevMonth }, { lastMonth: lastMonth })

    const closeModal = () => {
        setModalOpen(false)
    }

    return (
        <>
            <Flex direction="column">
                <Text size="xl" fw="800" ml="xs">
                    {currentYear}
                </Text>
                <Button
                    variant="filled"
                    onClick={() => {
                        setModalOpen(true)
                    }}
                >
                    Button
                </Button>
                {!!modalOpen && <NewEventModal closeModal={closeModal} />}
                <Flex justify="space-evenly" align="stretch">
                    {[-1,0,2,3,4,5,6,7,8,9,10,11].map((monthIndex) => (
                        <Month key={month} index={index} />
                    ))}
                </Flex>
            </Flex>
        </>
    )
}

export default Header

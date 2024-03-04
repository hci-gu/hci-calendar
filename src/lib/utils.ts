import moment from 'moment'
import { colorType } from './mantineConfig'
import { EventTypeType } from '../types/zod'
import { EventType, Row } from '../types/types'
import { useViewportSize } from '@mantine/hooks'

export const calendarStart = () =>
    moment().subtract(1, 'months').startOf('month').toDate()
export const calendarEnd = () =>
    moment().add(10, 'months').endOf('month').toDate()
export const numDays = () => {
    const start = calendarStart()
    const end = calendarEnd()
    return moment(end).diff(moment(start), 'days')
}
export const dayWidth = (viewportWidth: number) => {
    const days = numDays()
    return viewportWidth / days
}

export const positionAndWidthForDates = (
    dates: (Date | null)[],
    viewportWidth: number
): [xPos: number, width: number] => {
    const start = calendarStart()

    const lastDate = dates[dates.length - 1]
    const daysFromStartToLast = moment(lastDate).diff(start, 'days')
    const firstDate = dates[0]
    const daysFromStartToFirst = moment(lastDate).diff(firstDate, 'days')

    const xPos = daysFromStartToLast * dayWidth(viewportWidth)
    const width = daysFromStartToFirst * dayWidth(viewportWidth)

    return [xPos - width, width]
}

const elementWidthOfDeadlineTitle = (title: string) => {
    const letterWidth = 12
    const padding = 9.5
    const iconGap = 24

    return title.length * letterWidth + padding + iconGap * 2
}

const elementWidthOfTitle = (title: string) => {
    const letterWidth = 16
    return title.length * letterWidth
}

export const getColor = (type: EventTypeType): colorType => {
    switch (type) {
        case 'Funding':
            return 'HCI-Blue'
        case 'Publication':
            return 'HCI-Green'
        case 'Conference':
            return 'HCI-Purple'
        case 'Journal':
            return 'HCI-Red'
        default:
            return 'HCI-Red'
    }
}

export const sortEventsByFirstDeadlineTimestamp = (events: EventType[]) => {
    return events.sort((a, b) => {
        if (a.deadlines[0].timestamp && b.deadlines[0].timestamp) {
            const deadlineA = a.deadlines[0].timestamp.getTime()
            const deadlineB = b.deadlines[0].timestamp.getTime()
            return deadlineA - deadlineB
        }
        return 0
    })
}

const startOfEvent = (event: EventType) => event.deadlines[0].timestamp
const endOfEvent = (event: EventType) =>
    event.deadlines[event.deadlines.length - 1].timestamp
const isSameDay = (a: moment.Moment, b: moment.Moment) => {
    return a.year == b.year && a.month == b.month && a.day == b.day
}

const eventsDontOverlap = (
    eventA: EventType,
    eventB: EventType,
    viewportWidth: number
) => {
    /* Event A */
    const [deadlineXCoordinateEventA, deadlineWidthEventA] =
        positionAndWidthForDates(
            eventA.deadlines.map((deadline) => deadline.timestamp),
            viewportWidth
        )
    const eventAWidth =
        elementWidthOfDeadlineTitle(eventA.deadlines[0].name) >
        elementWidthOfTitle(eventA.title)
            ? elementWidthOfDeadlineTitle(eventA.deadlines[0].name)
            : elementWidthOfTitle(eventA.title)

    const startOfEventA = deadlineXCoordinateEventA - eventAWidth
    const endOfEventA = startOfEventA + deadlineWidthEventA + eventAWidth

    /* Event B */
    const [deadlineXCoordinateEventB, deadlineWidthEventB] =
        positionAndWidthForDates(
            eventB.deadlines.map((deadline) => deadline.timestamp),
            viewportWidth
        )
    const eventBWidth =
        elementWidthOfDeadlineTitle(eventB.deadlines[0].name) >
        elementWidthOfTitle(eventB.title)
            ? elementWidthOfDeadlineTitle(eventB.deadlines[0].name)
            : elementWidthOfTitle(eventB.title)

    const startOfEventB = deadlineXCoordinateEventB - eventBWidth
    const endOfEventB = startOfEventB + deadlineWidthEventB + eventBWidth

    return startOfEventA > endOfEventB || startOfEventB > endOfEventA
}

const ROW_HEIGHT = 200

const initializeRows = (viewportHeight: number) => {
    const initialY = 100
    const numberOfRows = Math.floor((viewportHeight - initialY) / ROW_HEIGHT)
    const rows: Row[] = []
    for (let i = 0; i < numberOfRows; i++) {
        rows.push({ y: initialY + ROW_HEIGHT * i, eventsInRow: [] })
    }
    return rows
}

export const sortEventsIntoRows = ({
    events,
    viewportHeight,
    viewportWidth,
}: {
    events: EventType[]
    viewportHeight: number
    viewportWidth: number
}) => {
    const rows = initializeRows(viewportHeight)

    if (events.length == 0) return rows

    rows[0].eventsInRow.push(events[0])

    for (const event of events.slice(1)) {
        let eventPlaced = false

        for (const row of rows) {
            if (row.eventsInRow.length === 0 && !eventPlaced) {
                row.eventsInRow.push(event)
                eventPlaced = true
                break
            }

            const isEventOverlapping = row.eventsInRow.every((currentEvent) =>
                eventsDontOverlap(currentEvent, event, viewportWidth)
            )

            if (isEventOverlapping) {
                row.eventsInRow.push(event)
                eventPlaced = true
                break
            }
        }
    }
    return rows
}

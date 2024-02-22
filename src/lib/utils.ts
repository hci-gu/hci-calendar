import moment from 'moment'
import { colorType } from './mantineConfig'
import { EventTypeType } from '../types/zod'
import { EventType, Row } from '../types/types'

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

export const getColor = (type: EventTypeType): colorType => {
    switch (type) {
        case 'funding':
            return 'HCI-Blue'
        case 'publication':
            return 'HCI-Green'
        default:
            return 'HCI-Red'
    }
}


export const sortEventsByFirstDeadlineTimestamp = (events: EventType[]) => {
    return events.sort((a, b) => {
        const deadlineA = a.deadlines[0].timestamp.getTime()
        const deadlineB = b.deadlines[0].timestamp.getTime()
        return deadlineA - deadlineB
    })
}

const startOfEvent = (event: any) => event.deadlines[0].timestamp
const endOfEvent = (event: any) =>
    event.deadlines[event.deadlines.length - 1].timestamp
const isSameDay = (a: any, b: any) => {
    const dateA = moment(a)
    const dateB = moment(b)
    return (
        dateA.year == dateB.year &&
        dateA.month == dateB.month &&
        dateA.day == dateB.day
    )
}

const eventsDontOverlap = (eventA: EventType, eventB: EventType) => {
    const startA = moment(startOfEvent(eventA))
    const startB = moment(startOfEvent(eventB))
    const endB = moment(endOfEvent(eventB))

    return startA.isAfter(endB) && isSameDay(startA, startB)
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
}: {
    events: EventType[]
    viewportHeight: number
}) => {
    const rows = initializeRows(viewportHeight)

    if (events.length == 0) return rows

    rows[0].eventsInRow.push(events[0])

    for (let i = 1; i < events.length; i++) {
        const event = events[i]
        let eventPlaced = false

        for (const row of rows) {
            if (row.eventsInRow.length === 0 && !eventPlaced) {
                row.eventsInRow.push(event)
                eventPlaced = true
                break
            }

            if (row.eventsInRow.every((e) => eventsDontOverlap(event, e))) {
                row.eventsInRow.push(event)
                eventPlaced = true
                break
            }
        }
    }
    return rows
}
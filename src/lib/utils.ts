import moment from 'moment'
import { EventType } from '../types/types'
import { colorType } from './mantineConfig'
import { EventTypeType } from '../types/zod'

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

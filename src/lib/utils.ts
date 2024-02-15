import moment from 'moment'

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
    console.log('days', days, viewportWidth)
    return viewportWidth / days
}

// export const dateToPosition = (date, width) => {
//     const startDate = moment().startOf('year')
//     const endDate = moment().endOf('year')
//     const days = moment(endDate).diff(moment(startDate), 'days')
//     const x = (moment(date).diff(moment(startDate), 'days') * width) / days
//     return x
// }

export const positionAndWidthForDates = (
    dates: Date[],
    viewportWidth: number
) => {
    const start = calendarStart()
    const end = calendarEnd()

    const lastDate = dates[dates.length - 1]
    const daysFromStartToLast = moment(lastDate).diff(start, 'days')
    const firstDate = dates[0]
    const daysFromStartToFirst = moment(lastDate).diff(firstDate, 'days')

    const xPos = daysFromStartToLast * dayWidth(viewportWidth)
    const width = daysFromStartToFirst * dayWidth(viewportWidth)

    return [xPos - width, width]
}

export const gridSizeForWidth = (width: number) => Math.max(1, dayWidth(width))

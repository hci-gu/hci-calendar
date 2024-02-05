import moment from 'moment'

export const positionToDate = (x, width) => {
    const startDate = moment().startOf('year')
    const endDate = moment().endOf('year')
    const days = moment(endDate).diff(moment(startDate), 'days')
    const date = moment(startDate).add((days * x) / width, 'days')
    return date
}

// export const dateToPosition = (date, width) => {
//     const startDate = moment().startOf('year')
//     const endDate = moment().endOf('year')
//     const days = moment(endDate).diff(moment(startDate), 'days')
//     const x = (moment(date).diff(moment(startDate), 'days') * width) / days
//     return x
// }

export const dateToPosition = (start, end, viewport) => {
    const yearstartDate = moment().startOf('year')
    const yearEndDate = moment().endOf('year')
    const days = moment(yearEndDate).diff(moment(yearstartDate), 'days')
    const x =
        (moment(start).diff(moment(yearstartDate), 'days') * viewport) / days
    console.log('X:', x)
    const y = 90
    return { x, y }
}

export const dateToWidth = (start, end, viewport) => {
    const yearstartDate = moment().startOf('year')
    const yearEndDate = moment().endOf('year')
    const days = moment(yearEndDate).diff(moment(yearstartDate), 'days')
    const width = (moment(end).diff(moment(start), 'days') * viewport) / days
    console.log('card Width:', width)
    return width
}

export const gridSizeForWidth = (width) => {
    const daysInYear = moment()
        .endOf('year')
        .diff(moment().startOf('year'), 'days')
    const gridSize = Math.round(width / daysInYear)
    return Math.max(1, gridSize)
}

export const positionToPixel = (position, viewport) => {
    console.log('positionToPixel', position, viewport)
    // position.x is value from 0 to 365
    // position.y is value from 0 to 100
    const percentX = position.x / 365
    console.log(viewport.width, percentX)
    console.log(viewport.width * percentX)

    const x = Math.round(viewport.width * (position.x / 365))
    const y = Math.round(viewport.height * (position.y / 100))
    console.log('x', x, 'y', y)
    return { x, y }
}

export const pixelToPosition = (pixel, viewport) => {
    console.log('pixel', pixel, 'viewport', viewport)
    // pixel.x is value from 0 to width
    // pixel.y is value from 0 to height
    const x = Math.round((pixel.x * 365) / viewport.width)
    const y = Math.round((pixel.y * 100) / viewport.height)
    console.log('x', x, 'y', y)
    return { x, y }
}

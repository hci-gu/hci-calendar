import { DraggableData } from 'react-rnd'
import { EventAtom, SetAtom, sizeType } from '../types/types'
import { SetStateAction } from 'jotai'

type setIsDragging = React.Dispatch<React.SetStateAction<boolean>>

export const onDrag = (
    dragg: DraggableData,
    size: sizeType,
    id: number,
    setEvents: SetAtom<[SetStateAction<EventAtom[]>], void>
) => {
    setEvents((events) => {
        const index = events.findIndex((ev) => ev.id === id)
        const newEvents = [...events]
        newEvents[index] = {
            ...newEvents[index],
            position: { x: dragg.x, y: dragg.y },
            size,
        }
        return newEvents
    })
}

export const onResize = (
    ref: HTMLElement,
    id: number,
    setEvents: SetAtom<[SetStateAction<EventAtom[]>], void>
) => {
    setEvents((events) => {
        const index = events.findIndex((ev) => ev.id === id)
        const newEvents = [...events]
        newEvents[index] = {
            ...newEvents[index],
            size: {
                width: parseFloat(ref.style.width),
                height: parseFloat(ref.style.height),
            },
        }
        return newEvents
    })
}

export const onDragStop = (setIsDragging: setIsDragging) => {
    setIsDragging(false)
}

export const onDragStart = (setIsDragging: setIsDragging) => {
    setIsDragging(true)
}

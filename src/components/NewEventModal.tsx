import { Button, Flex, Group, Modal, TextInput, Textarea } from '@mantine/core'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { DateInput, DateValue } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { FormEvent, useEffect, useState } from 'react'
import supabase, { eventsAtom, useEvents } from '../state'
import { useAtom, useSetAtom } from 'jotai'
import { dateToPosition, dateToWidth } from '../utils'
import { z } from 'zod'

const NewEventModal = () => {
    const FormDataScheama = z.object({
        title: z.string().min(3),
        startDate: z.date(),
        endDate: z.date(),
        description: z.string(),
    })

    const NewScheama = FormDataScheama.extend({
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
    })
    type FromData = z.infer<typeof NewScheama>

    const [opend, { open, close }] = useDisclosure(false)
    const [formData, setFormData] = useState<FromData>({
        title: '',
        startDate: null,
        endDate: null,
        description: '',
    })
    const [events, setEvents] = useAtom(eventsAtom)
    const viewport = useViewportSize()
    const [errors, setErrors] = useState({
        title: '',
        startDate: '',
        endDate: '',
    })

    const insertSupabase = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let tempErrors = { title: '', startDate: '', endDate: '' }
        const parsedData = FormDataScheama.safeParse(formData)
        if (parsedData.success) {
            setErrors(tempErrors)
            const { data, error } = await supabase
                .from('events')
                .insert({
                    start: formData.startDate?.toISOString()
                        ? formData.startDate?.toISOString()
                        : null,
                    end: formData.endDate?.toISOString()
                        ? formData.endDate?.toISOString()
                        : null,
                    title: formData.title,
                    description: formData?.description,
                })
                .select()
                .single()
            if (error) {
                console.log(error)
                return
            }
            setFormData({
                title: '',
                startDate: null,
                endDate: null,
                description: '',
            })
            //@ts-ignore
            setEvents([
                ...events,
                {
                    ...data,
                    position: dateToPosition(
                        data.start,
                        viewport.width,
                        data.y
                    ),
                    size: {
                        width: dateToWidth(
                            data.start,
                            data.end,
                            viewport.width
                        ),
                        height: 65,
                    },
                },
            ])
        } else {
            const keys = ['title', 'startDate', 'endDate']
            parsedData.error.issues.map((issue) => {
                keys.map((key) => {
                    if (issue.path[0] === key) {
                        tempErrors = { ...tempErrors, [key]: issue.message }
                    }
                })
            })

            setErrors(tempErrors)
        }
    }
    useEffect(() => {
        console.log(errors)
    }, [errors])

    return (
        <>
            <Modal title="New Event" opened={opend} onClose={close} centered>
                <form onSubmit={(e) => insertSupabase(e)}>
                    <Flex align="center" direction="column" w="100%" gap={16}>
                        <TextInput
                            w="100%"
                            label="Event Title"
                            withAsterisk
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }}
                        />
                        <Group justify="space-between" w="100%">
                            <DateInput
                                label="Start date"
                                placeholder="2024-01-01"
                                valueFormat="YYYY-MM-DD"
                                withAsterisk
                                value={formData.startDate}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        startDate: e,
                                    })
                                }}
                            />
                            <DateInput
                                label="End Date"
                                placeholder="2024-01-01"
                                valueFormat="YYYY-MM-DD"
                                withAsterisk
                                value={formData.endDate}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        endDate: e,
                                    })
                                }}
                            />
                        </Group>
                        <Textarea
                            w="100%"
                            label="Event Description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }}
                        />
                        <Button type="submit" onClick={close}>
                            submit
                        </Button>
                    </Flex>
                </form>
            </Modal>
            <div>
                <Button onClick={open} variant="filled">
                    New Event
                </Button>
            </div>
        </>
    )
}

export default NewEventModal

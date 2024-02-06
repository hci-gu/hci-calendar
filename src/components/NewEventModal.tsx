import { Button, Flex, Group, Modal, TextInput, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DateInput, DateValue } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const NewEventModal = () => {
    type FromData = {
        title: string
        startDate: DateValue
        endDate: DateValue
        description: string
    }
    const [opend, { open, close }] = useDisclosure(false)
    const [formData, setFormData] = useState<FromData>({
        title: '',
        startDate: null,
        endDate: null,
        description: '',
    })
    const supabase = createClient(
        //@ts-ignore
        import.meta.env.VITE_SUPABASE_URL,
        //@ts-ignore
        import.meta.env.VITE_SUPABASE_KEY
    )

    const insertSupabase = async (e: any) => {
        e.preventDefault()
        const { error } = await supabase.from('events').insert({
            start: formData.startDate,
            end: formData.endDate,
            title: formData.title,
            description: formData.description,
        })
        if (error) {
            console.log(error)
        }
        setFormData({
            title: '',
            startDate: null,
            endDate: null,
            description: '',
        })
        close
    }

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
                        <Button type="submit">submit</Button>
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

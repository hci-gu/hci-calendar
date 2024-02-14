import { Button, Flex, Modal, Stack, Text, TextInput } from '@mantine/core'
import '@mantine/dates/styles.css'
import { useDisclosure } from '@mantine/hooks'
import { DeadlineType, FromData } from './state'
import Deadline from './components/Deadline'
import DropdownSelect from './components/DropdownSelect'
import NewDeadline from './components/NewDeadline'
import { FormEvent, useEffect, useState } from 'react'
import { FormDataValidateschema } from './schemas'
import supabase from '../../lib/state'

const NewEventModal = () => {
    const [opend, { open, close }] = useDisclosure(false)
    const [formData, setFormData] = useState<FromData>({
        title: '',
        type: null,
        deadlines: [],
    })

    const [errors, setErrors] = useState({
        title: '',
        type: '',
        deadlines: '',
    })

    const onNewDeadline = (newDeadline: DeadlineType) => {
        setFormData({
            ...formData,
            deadlines: [...formData.deadlines, newDeadline],
        })
    }

    const onDeadlineUpdated = (newDeadline: DeadlineType, index: number) => {
        setFormData({
            ...formData,
            deadlines: [
                ...formData.deadlines.slice(0, index),
                newDeadline,
                ...formData.deadlines.slice(
                    index + 1,
                    formData.deadlines.length
                ),
            ],
        })
    }

    const onDropdownUpdate = (option: string) => {
        //@ts-ignore
        setFormData({ ...formData, type: option })
    }

    const insertSupabase = async (
        e: FormEvent<HTMLFormElement>,
        formData: FromData
    ) => {
        e.preventDefault()
        let tempErrors = { title: '', type: '', deadlines: '' }
        const parsedData = FormDataValidateschema.safeParse(formData)
        if (parsedData.success) {
            setErrors(tempErrors)
            //@ts-ignore
            const { data, error } = await supabase
                .from('newEvent')
                .insert({
                    title: formData.title,
                    type: formData.type,
                    deadlines: JSON.stringify(formData.deadlines),
                })
                .select()
                .single()
            if (error) {
                console.log(error)
                close
                return
            }
        } else {
            const keys = ['title', 'type', 'deadlines']
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

    return (
        <>
            <Modal
                title="New Event"
                opened={opend}
                onClose={close}
                centered
                radius={24}
            >
                <form
                    onSubmit={(e) => {
                        insertSupabase(e, formData)
                        close
                    }}
                >
                    <Flex align="center" direction="column" w="100%" gap={16}>
                        <Flex align="flex-end" gap={16} w="100%">
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
                                error={errors.title !== '' ? errors.title : ''}
                            />
                            <DropdownSelect onUpdate={onDropdownUpdate} />
                        </Flex>
                        {errors.type !== '' && <Text>{errors.type}</Text>}
                        <Stack w={'100%'}>
                            {formData.deadlines.map((deadline, i) => (
                                <Deadline
                                    key={deadline.name}
                                    deadline={deadline}
                                    onUpdate={onDeadlineUpdated}
                                    index={i}
                                />
                            ))}
                            {errors.deadlines !== '' && (
                                <Text>{errors.deadlines}</Text>
                            )}
                            <NewDeadline onSave={onNewDeadline} />
                        </Stack>
                        <Button type="submit" w={'100%'} radius="md">
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

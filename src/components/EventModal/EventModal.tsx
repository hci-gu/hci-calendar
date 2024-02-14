import { Button, Flex, Modal, Stack, Text, TextInput } from '@mantine/core'
import '@mantine/dates/styles.css'
import { useDisclosure, useViewportSize } from '@mantine/hooks'
import { eventsAtom } from '../../lib/state'
import { useAtom } from 'jotai'
import { errorsAtom, formDataAtom } from './state'
import Deadline from './SubComponents/Deadline'
import DropdownSelect from './SubComponents/DropdownSelect'
import NewDeadline from './SubComponents/NewDeadline'
import insertSupabase from './utils'

const NewEventModal = () => {
    const [opend, { open, close }] = useDisclosure(false)
    const [formData, setFormData] = useAtom(formDataAtom)
    const [events, setEvents] = useAtom(eventsAtom)
    const viewport = useViewportSize()
    const [errors, setErrors] = useAtom(errorsAtom)

    return (
        <>
            <Modal
                title="New Event"
                opened={opend}
                onClose={close}
                centered
                radius={24}
            >
                <form onSubmit={(e) => insertSupabase(e)}>
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
                            <DropdownSelect />
                        </Flex>
                        {errors.type !== '' && <Text>{errors.type}</Text>}
                        <Stack w={'100%'}>
                            {formData.deadlines.map((deadline) => (
                                <Deadline
                                    key={deadline.name}
                                    deadline={deadline}
                                />
                            ))}
                            {errors.deadlines !== '' && (
                                <Text>{errors.deadlines}</Text>
                            )}
                            <NewDeadline />
                        </Stack>
                        <Button
                            type="submit"
                            // onClick={close}
                            w={'100%'}
                            radius="md"
                        >
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

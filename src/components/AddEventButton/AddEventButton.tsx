import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ActionIcon } from '@mantine/core'
import { useState } from 'react'
import NewEventModal from '../EventModal/EventModal'

const AddEventButton = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const closeModal = () => {
        setModalOpen(false)
    }
    return (
        <>
            <ActionIcon
                pos="absolute"
                bottom={100}
                right={100}
                variant="outline"
                onClick={() => {
                    setModalOpen(true)
                }}
                size={50}
            >
                <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
            {!!modalOpen && <NewEventModal closeModal={closeModal} />}
        </>
    )
}

export default AddEventButton

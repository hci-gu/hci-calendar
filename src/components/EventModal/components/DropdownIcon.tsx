import { getIcon } from '../../../lib/utils'
import { IconType } from '@/src/types/zod'
import { Combobox, Flex, Input, InputBase, useCombobox , Text} from '@mantine/core'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DropdownIcon = ({
    onUpdate,
    selectedOption,
}: {
    onUpdate: (option: string) => void
    selectedOption?: string | null
}) => {
    const category: IconType[] = ['Bell Icon', 'Paper Icon']

    const [dropDownValue, setDropDownValue] = useState(
        selectedOption
    )

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const options = category.map((item) => {
        return (
            <Combobox.Option value={item} key={item}>
                <Flex align="center" gap="sm">
                    <FontAwesomeIcon color='var(--mantine-primary-color-filled)' icon={getIcon(item)} />
                    <Text>{item}</Text>
                </Flex>
            </Combobox.Option>
        )
    })
    return (
        <Combobox
            size="xl"
            store={combobox}
            onOptionSubmit={(val) => {
                setDropDownValue(val)
                onUpdate(val)
                combobox.closeDropdown()
            }}
        >
            <Combobox.Target>
                <InputBase
                    size="xl"
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {dropDownValue || (
                        <Input.Placeholder>Icon</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default DropdownIcon

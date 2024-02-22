import { getColor } from '../../../lib/utils'
import { EventTypeType } from '@/src/types/zod'
import { Combobox, Flex, Input, InputBase, useCombobox } from '@mantine/core'
import { useState } from 'react'

const DropdownSelect = ({
    onUpdate,
    selectedOption,
}: {
    onUpdate: (option: string) => void
    selectedOption?: string | null
}) => {
    const category: EventTypeType[] = ['funding', 'publication']

    const [dropDownValue, setDropDownValue] = useState(
        selectedOption
    )

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const options = category.map((item) => {
        if (!item) {
            return
        }
        return (
            <Combobox.Option value={item} key={item}>
                <Flex align="center" gap="sm">
                    <div style={{ contain: '', width: '1.5rem', height: "1.5rem", borderRadius: "50%", backgroundColor: `var(--mantine-color-${getColor(item)}-4)` }}></div>
                    {item}
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
                        <Input.Placeholder>pick</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default DropdownSelect

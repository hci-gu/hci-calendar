import { EventTypeType } from '@/src/types/types'
import { Combobox, Input, InputBase, useCombobox } from '@mantine/core'
import { useState } from 'react'

const DropdownSelect = ({
    onUpdate,
}: {
    onUpdate: (option: string) => void
}) => {
    const [dropDownValue, setDropDownValue] = useState('')

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const types: EventTypeType[] = ['funding', 'publication']
    const options = types.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ))
    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                setDropDownValue(val)
                onUpdate(val)
                combobox.closeDropdown()
            }}
        >
            <Combobox.Target>
                <InputBase
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

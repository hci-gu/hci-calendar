import { Combobox, Input, InputBase, useCombobox } from '@mantine/core'
import { useState } from 'react'

const processOption = (option: string | null | undefined) => {
    if (!option) {
        return
    }
    const cleanedString =
        option.charAt(0) + option.slice(1).replace(/[a-zA-Z]/g, '')
    return cleanedString
}

const DropdownSelect = ({
    onUpdate,
    selectedOption,
}: {
    onUpdate: (option: string) => void
    selectedOption?: string | null
}) => {
    const category = ['🔴 funding', '🟢 publication']

    const [dropDownValue, setDropDownValue] = useState(
        processOption(selectedOption) ?? ''
    )

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const options = category.map((item) => (
        <Combobox.Option value={item} key={item}>
            {processOption(item)}
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
                    {processOption(dropDownValue) || (
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

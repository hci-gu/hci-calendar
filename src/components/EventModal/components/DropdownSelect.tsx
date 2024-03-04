import { Combobox, Input, InputBase, useCombobox } from '@mantine/core'
import { useState } from 'react'

const DropdownIcon = ({
    onUpdate,
    selectedOption,
    children,
}: {
    onUpdate: (option: string) => void
    selectedOption?: string | null,
    children: React.ReactNode
}) => {


    const [dropDownValue, setDropDownValue] = useState(
        selectedOption
    )

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    
    return (
        <Combobox
            size="lg"
            store={combobox}
            onOptionSubmit={(val) => {
                setDropDownValue(val)
                onUpdate(val)
                combobox.closeDropdown()
            }}
        >
            <Combobox.Target>
                <InputBase
                    size="lg"
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {dropDownValue || (
                        <Input.Placeholder>{selectedOption}</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
                {children}
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default DropdownIcon

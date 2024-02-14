import { Combobox, Input, InputBase, useCombobox } from '@mantine/core'
import { formDataAtom } from '../state'
import { useAtom } from 'jotai'

const DropdownSelect = () => {
    const [formData, setFormData] = useAtom(formDataAtom)

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const types = ['funding', 'publication']
    const options = types.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ))
    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                //@ts-ignore
                setFormData({ ...formData, type: val })
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
                    {formData.type || (
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

import { ReactNode } from 'react'
import { getColor, getIcon } from '../../../lib/utils'
import { EventTypeType, IconType } from '../../../types/zod'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Combobox, Flex, Text } from "@mantine/core"

export const ComboboxOptions = ({ optionsValues }: { optionsValues: IconType[] | EventTypeType[] }) => {
    console.log({ typeValue: JSON.stringify(Object.values(IconType.Values)), optionsValues: JSON.stringify(optionsValues) });
    console.log(Object.values(IconType.Values).includes(optionsValues[0] as IconType));



    if (Object.values(IconType.Values) === optionsValues) {
        optionsValues.map((item) => {
            return (
                <Combobox.Option value={item} key={item}>
                    <Flex align="center" gap="sm">
                        <FontAwesomeIcon color='var(--mantine-primary-color-filled)' icon={getIcon(item)} />
                        <Text>{item}</Text>
                    </Flex>
                </Combobox.Option>
            )
        })
    } else if (Object.values(EventTypeType.Values) === optionsValues) {
        optionsValues.map((item) => {
            return (
                <Combobox.Option value={item} key={item}>
                    <Flex align="center" gap="sm">
                        <div style={{ contain: '', width: '1.5rem', height: "1.5rem", borderRadius: "50%", backgroundColor: `var(--mantine-color-${getColor(item)}-4)` }}></div>
                        <Text>{item}</Text>
                    </Flex>
                </Combobox.Option>
            )
        })
    }
}
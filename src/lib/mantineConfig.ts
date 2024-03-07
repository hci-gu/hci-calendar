import { DefaultMantineColor, createTheme } from '@mantine/core'

const colors = {
    'HCI-Purple': [
        '#E59BFF', // 50
        '#E59BFF', // 100
        '#E59BFF', // 200
        '#E59BFF', // 300
        '#E59BFF', // 400
        '#D666FF', // 500
        '#D666FF', // 600
        '#D666FF', // 700
        '#4F006B', // 800
        '#4F006B', // 900
    ],
    'HCI-Green': [
        '#A9FF9B', // 50
        '#A9FF9B', // 100
        '#A9FF9B', // 200
        '#A9FF9B', // 300
        '#A9FF9B', // 400
        '#7AFF66', // 500
        '#0F6B00', // 600
        '#0F6B00', // 700
        '#0F6B00', // 800
        '#0F6B00', // 900
    ],
    'HCI-Blue': [
        '#9BE7FF', // 50
        '#9BE7FF', // 100
        '#9BE7FF', // 200
        '#9BE7FF', // 300
        '#9BE7FF', // 400
        '#66DBFF', // 500
        '#00516B', // 600
        '#00516B', // 700
        '#00516B', // 800
        '#00516B', // 900
    ],
    'HCI-Red': [
        '#FF9B9B', // 50
        '#FF9B9B', // 100
        '#FF9B9B', // 200
        '#FF9B9B', // 300
        '#FF9B9B', // 400
        '#FF6666', // 500
        '#6B0000', // 600
        '#6B0000', // 700
        '#6B0000', // 800
        '#6B0000', // 900
    ],
} as const

export const theme = createTheme({
    colors: colors,
    fontFamily: '"Roboto Mono Variable", monospace',
    fontFamilyMonospace: 'monospace',
})

export type colorType = keyof typeof colors | DefaultMantineColor

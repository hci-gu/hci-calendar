import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './index.css'
import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import '@fontsource-variable/roboto-mono'

import { theme } from './lib/mantineConfig'



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </MantineProvider>
    </React.StrictMode>
)

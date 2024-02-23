// import React from 'react'
// import ReactDOM from 'react-dom/client'
import App from './App'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './index.css'
import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import '@fontsource-variable/roboto-mono'

import { theme } from './lib/mantineConfig'


import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />
        </DndProvider>
      </MantineProvider>
    </StrictMode >,
  )
}
// ReactDOM.createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//         <MantineProvider theme={theme}>
//             <DndProvider backend={HTML5Backend}>
//                 <App />
//             </DndProvider>
//         </MantineProvider>
//     </React.StrictMode>
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import Loader from './utils/Loader.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
    <PersistGate loading={<Loader />} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)

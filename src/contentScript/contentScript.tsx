import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Card } from '@mui/material'
import WeatherCard from '../components/WeatherCard'
import { LocalStorageOptions, getStoredOptions } from '../utils/storage'
import { Messages } from '../utils/messages'
import './contentScript.css'

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [isActive, setisActive] = useState<boolean>(false)

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options)
      setisActive(options.hasAutoOverlay)
    })
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === Messages.TOGGLE_OVERLAY) {
        setisActive(!isActive)
      }
    })
  }, [isActive])

  if (!options) {
    return null
  }

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setisActive(false)}
          />
        </Card>
      )}
    </>
  )
}

const rootElement = document.createElement('div')
document.body.appendChild(rootElement)

const root = createRoot(rootElement)
root.render(<App />)

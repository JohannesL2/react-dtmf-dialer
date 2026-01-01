import React, { useRef, useState, useEffect } from 'react'
import NumberInput from './NumberInput'

    const DTMF_FREQUENCIES = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        '4': [770, 1209],
        '5': [770, 1336],
        '6': [770, 1477],
        '7': [852, 1209],
        '8': [852, 1336],
        '9': [852, 1477],
        '*': [941, 1209],
        '0': [941, 1336],
        '#': [941, 1477],
    }

   const keys = ['1','2','3','4','5','6','7','8','9','*','0','#']

export default function Dialer() {
    const audioContextRef = useRef(null)
    const [pressedKeys, setPressedKeys] = useState([])
    const [inputValue, setInputValue] = useState('')

    const playDTMF = (key, duration = 150) => {
        if (!DTMF_FREQUENCIES[key]) return

        if (document.activeElement.tagName === 'INPUT') return

        if (!audioContextRef.current) {
            audioContextRef.current =
                new (window.AudioContext || window.webkitAudioContext)()
        }

        const audioContext = audioContextRef.current
        const [low, high] = DTMF_FREQUENCIES[key]

        const gainNode = audioContext.createGain()
        gainNode.gain.value = 0.1
        gainNode.connect(audioContext.destination)

        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()

        osc1.frequency.value = low
        osc2.frequency.value = high

        osc1.connect(gainNode)
        osc2.connect(gainNode)

        osc1.start()
        osc2.start()

        setTimeout(() => {
            osc1.stop()
            osc2.stop()
        }, duration)
    }

    const handleButtonClick = (key) => {
        setPressedKeys(prev => [...prev, key])
        playDTMF(key)
    }

    const clearDisplay = () => setPressedKeys([])

    const handleSend = () => {
        if (!inputValue) return
        const sequence = inputValue.split('')
        sequence.forEach((key, index) => {
            setTimeout(() => {
                playDTMF(key)
                setPressedKeys(prev => [...prev, key])
            }, index * 200)
        })
        setInputValue('')
    }

    useEffect(() => {
    const handleKeyDown = (e) => {
        if ('1234567890*#'.includes(e.key)) {
            if (document.activeElement.tagName === 'INPUT') return
            playDTMF(e.key)
        }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
   }, [])

  return (
    <div className='phone'>
        <div className='screen'>
            {pressedKeys.join('') || ' '}
        </div>
    <div className='dialer'>
        {keys.map((key) => (
            <button
                key={key}
                onClick={() => handleButtonClick(key)}
                aria-label={`Dial ${key}`}
            >
                {key}
            </button>
        ))}
    </div>
    <button 
        className='clear' 
        onClick={clearDisplay}
        >
            Clear
        </button>

        <NumberInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
        />
    </div>
  )
}

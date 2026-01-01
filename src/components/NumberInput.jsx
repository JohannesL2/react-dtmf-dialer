import React from 'react'

export default function NumberInput({inputValue, setInputValue, handleSend}) {
  return (
    <div className='numberInput'>
        <input
            type="text" 
            value={inputValue}
            onChange={(e) => {
                setInputValue(e.target.value.replace(/[^0-9*#]/g, ''))
            }}
            />
        <button
            onClick={handleSend}
        >
            Send
        </button>
    </div>
  )
}

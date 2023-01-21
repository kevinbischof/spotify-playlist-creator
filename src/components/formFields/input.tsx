import React, { ReactElement } from 'react'

type InputProps = {
    value: string
    placeholder: string
    className: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
}

export function Input({
    value,
    onChange,
    onKeyDown,
    placeholder = '',
    className = '',
}: InputProps): ReactElement {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={className}
        />
    )
}

import React, { ReactElement } from 'react'
import './checkbox.css'

type CheckboxProps = {
    className?: string
    label?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Checkbox({
    onChange,
    className = '',
    label,
}: CheckboxProps): ReactElement {
    return (
        <div>
            {label && <legend>{label}</legend>}
            <input
                type="checkbox"
                className={className}
                id="vehicle1"
                name="vehicle1"
                value="Public"
                onChange={onChange}
            />
        </div>
    )
}

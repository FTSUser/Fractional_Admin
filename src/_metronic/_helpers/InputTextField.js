import React from 'react'

export const InputTextField = ({
    type,
    name,
    value,
    onChange,
    placeholder,
    label,
    error,
    onKeyDown,
    min,
    maxlength,
    onInput,

}) => {
    return (
        <>
            <div className="form-group row">
                <label className="col-xl-3 col-lg-3 col-form-label">
                    {label}
                </label>
                <div className="col-lg-9 col-xl-6">
                    <div>
                        <input
                            type={type}
                            className={`form-control form-control-lg form-control-solid `}
                            id={name}
                            name={name}
                            value={value}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            min={min}
                            maxlength={maxlength}
                            onInput={onInput}
                            placeholder={placeholder}
                        />
                    </div>
                    <span style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                    }}>
                        {error}
                    </span>
                </div>
            </div>
        </>
    )
}

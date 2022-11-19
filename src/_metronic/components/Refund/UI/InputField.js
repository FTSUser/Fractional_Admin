import React from 'react'

function InputField({
    label,
    type,
    name,
    value,
    onChange,
    errors,
}) {
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
                            name={name}
                            value={value}
                            onChange={onChange}
                        />
                    </div>
                    <span className="errors">{errors}</span>
                </div>
            </div>
        </>
    )
}

export default InputField
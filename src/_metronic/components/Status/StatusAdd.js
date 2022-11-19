import React from 'react'

function StatusAdd(props) {
    const {
        inputValueForAdd,
        errorsForAdd,
        handleOnChangeAdd,
        handelAddStatusDetails,
        loading
    } = props;
    return (
        <>
            <div className="form full-container">
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Enter Name
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <div>
                            <input
                                type="text"
                                className={`form-control form-control-lg form-control-solid `}
                                id="name"
                                name="name"
                                value={inputValueForAdd.name}
                                onChange={(e) => {
                                    handleOnChangeAdd(e);
                                }}
                            />
                        </div>
                        <span
                            style={{
                                color: "red",
                                top: "5px",
                                fontSize: "12px",
                            }}
                        >
                            {errorsForAdd["name"]}
                        </span>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Enter Description
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <div>
                            <input
                                type="text"
                                className={`form-control form-control-lg form-control-solid `}
                                id="description"
                                name="description"
                                value={inputValueForAdd.description}
                                onChange={(e) => {
                                    handleOnChangeAdd(e);
                                }}
                            />
                        </div>
                        <span
                            style={{
                                color: "red",
                                top: "5px",
                                fontSize: "12px",
                            }}
                        >
                            {errorsForAdd["description"]}
                        </span>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                    <button
                        onClick={(e) => {
                            handelAddStatusDetails(e);
                        }}
                        className="btn btn-success mr-2"
                    >
                        <span>Add Details</span>
                        {loading && (
                            <span className="mx-3 spinner spinner-white"></span>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default StatusAdd
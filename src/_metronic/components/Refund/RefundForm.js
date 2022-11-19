import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ApiPost } from '../../../helpers/API/ApiData';
import InputField from './UI/InputField';

function RefundForm(props) {
    const [paymentMood, setPaymentMood] = useState('upi');
    const [inputValue, setInputValue] = useState({});
    const [errors, setErrors] = useState({});
    const [isSuccessPaymentForm, setIsSuccessPaymentForm] = useState(false);
    const adminId = JSON.parse(localStorage.getItem('userinfo')).admin.id;


    useEffect(() => {
        if (isSuccessPaymentForm) {
            props.getPaymentStatus(isSuccessPaymentForm);
        }
    }, [isSuccessPaymentForm]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
        setErrors({ ...errors, [name]: '' });
    }

    const handleValidateForm = () => {
        let errors = {};
        let formIsValid = true;
        if (paymentMood === 'upi') {
            if (!inputValue.upiId) {
                formIsValid = false;
                errors["upiId"] = "Please enter your UPI ID";
            }
        }
        if (paymentMood === 'neft') {
            if (!inputValue?.dateOftranx) {
                formIsValid = false;
                errors["dateOftranx"] = "Please enter your date of transaction";
            }
            if (!inputValue?.mode) {
                formIsValid = false;
                errors["mode"] = "Please select your mode";
            }
            if (!inputValue.accountNumber) {
                formIsValid = false;
                errors["accountNumber"] = "Please enter your account number";
            }
            if (!inputValue.bankName) {
                formIsValid = false;
                errors["bankName"] = "Please enter your bank name";
            }
            if (!inputValue.IFSC) {
                formIsValid = false;
                errors["IFSC"] = "Please enter your IFSC code";
            }
        }
        if (paymentMood === "cheque") {
            if (!inputValue.dateOftranx) {
                formIsValid = false;
                errors["dateOftranx"] = "Please enter your date of transaction";
            }
            if (!inputValue.chequeNumber) {
                formIsValid = false;
                errors["chequeNumber"] = "Please enter your cheque number";
            }
            if (!inputValue.bankName) {
                formIsValid = false;
                errors["bankName"] = "Please enter your bank name";
            }
            if (!inputValue.beneficiaryName) {
                formIsValid = false;
                errors["beneficiaryName"] = "Please enter your beneficiary name";
            }
        }
        if (paymentMood === "cash") {
            if (!inputValue.dateOftranx) {
                formIsValid = false;
                errors["dateOftranx"] = "Please enter your date of transaction";
            }
            if (!inputValue?.personName) {
                formIsValid = false;
                errors["personName"] = "Please enter your person name";
            }
        }
        setErrors(errors);
        return formIsValid;
    }




    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidateForm()) {
            if (paymentMood === 'upi') {
                let data = {
                    upiId: inputValue.upiId,
                    paymentMode: paymentMood,
                    uid: adminId
                }
                ApiPost("form/createForm", data)
                    .then(res => {
                        // toast.success(res.data.message);
                        setIsSuccessPaymentForm(true);
                    })
                    .catch(err => {
                        toast.error(err.response.data.message);
                    })
            } else if (paymentMood === "neft") {
                let data = {
                    dateOftranx: inputValue.dateOftranx,
                    mode: inputValue.mode,
                    accountNumber: inputValue.accountNumber,
                    IFSC: inputValue.IFSC,
                    paymentMode: paymentMood,
                    bankName: inputValue.bankName,
                    uid: adminId

                }
                ApiPost("form/createForm", data)
                    .then(res => {
                        // toast.success(res.data.message);
                        setIsSuccessPaymentForm(true);
                    })
                    .catch(err => {
                        toast.error(err.response.data.message);
                    })
            } else if (paymentMood === "cheque") {
                let data = {
                    dateOftranx: inputValue.dateOftranx,
                    chequeNumber: inputValue.chequeNumber,
                    bankName: inputValue.bankName,
                    beneficiaryName: inputValue.beneficiaryName,
                    paymentMode: paymentMood,
                    uid: adminId
                }
                ApiPost("form/createForm", data)
                    .then(res => {
                        // toast.success(res.data.message);
                        setIsSuccessPaymentForm(true);
                    })
                    .catch(err => {
                        toast.error(err.response.data.message);
                    })
            } else if (paymentMood === "cash") {
                let data = {
                    dateOftranx: inputValue.dateOftranx,
                    personName: inputValue.personName,
                    paymentMode: paymentMood,
                    uid: adminId
                }
                ApiPost("form/createForm", data)
                    .then(res => {
                        // toast.success(res.data.message);
                        setIsSuccessPaymentForm(true);
                    })
                    .catch(err => {
                        toast.error(err.response.data.message);
                    })
            }
        }
    }

    return (
        <>
            <div className="all-content-alignment-properties ">
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Select Payment Method
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <div className="input-group">
                            <select
                                className="form-control form-control-lg form-control-solid"
                                onChange={(e) => { setPaymentMood(e.target.value); setInputValue({}); setErrors({}) }}
                                value={paymentMood}
                            >
                                <option value="upi">UPI</option>
                                <option value="neft">NEFT/IMPS</option>
                                <option value="cheque">Cheque</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>

                    </div>
                </div>
                {paymentMood === "upi" &&
                    <InputField label="UPI" type="text" name="upiId" value={inputValue.upiId} onChange={handleChange} errors={errors["upiId"]} />
                }
                {paymentMood === "neft" &&
                    <>
                        <InputField label="Date Of Transaction" type="date" name="dateOftranx" value={inputValue.dateOftranx} onChange={handleChange} errors={errors["dateOftranx"]} />
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                NEFT/IMPS
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <div className="kt-radio-inline" onChange={handleChange}>
                                    <label className="kt-radio">
                                        <input type="radio" name="mode" value="neft" checked={inputValue.mode === "neft"} />
                                        <span>NEFT</span>
                                    </label>
                                    <label className="kt-radio">
                                        <input type="radio" name="mode" value="imps" checked={inputValue?.mode === "imps"} />
                                        <span>IMPS</span>
                                    </label>
                                </div>
                                <span className="errors">{errors["mode"]}</span>
                            </div>
                        </div>
                        <InputField label="Bank Name" type="text" name="bankName" value={inputValue.bankName} onChange={handleChange} errors={errors["bankName"]} />
                        <InputField label="A/c Number" type="text" name="accountNumber" value={inputValue.accountNumber} onChange={handleChange} errors={errors["accountNumber"]} />
                        <InputField label="IFSC Code" type="text" name="IFSC" value={inputValue.IFSC} onChange={handleChange} errors={errors["IFSC"]} />
                    </>
                }
                {paymentMood === "cheque" &&
                    <>
                        <InputField label="Date Of Transaction" type="date" name="dateOftranx" value={inputValue.dateOftranx} onChange={handleChange} errors={errors["dateOftranx"]} />
                        <InputField label="Cheque Number" type="text" name="chequeNumber" value={inputValue.chequeNumber} onChange={handleChange} errors={errors["chequeNumber"]} />
                        <InputField label="Bank Name" type="text" name="bankName" value={inputValue.bankName} onChange={handleChange} errors={errors["bankName"]} />
                        <InputField label="beneficiary Name" type="text" name="beneficiaryName" value={inputValue.beneficiaryName} onChange={handleChange} errors={errors["beneficiaryName"]} />
                    </>
                }
                {paymentMood === "cash" &&
                    <>
                        <InputField label="Date Of Transaction" type="date" name="dateOftranx" value={inputValue.dateOftranx} onChange={handleChange} errors={errors["dateOftranx"]} />
                        <InputField label="Responsible Person Name" type="text" name="personName" value={inputValue.personName} onChange={handleChange} errors={errors["personName"]} />
                    </>
                }
                <div className="d-flex align-items-center justify-content-center">
                    <button
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                        className="btn btn-success mr-2"
                    >
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default RefundForm
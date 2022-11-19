import React, { useState, useEffect } from "react";
import moment from "moment";
import { ApiPut } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";

export default function AllInformation(props) {
  const { dataViewMore, handleAllInfoClose } = props;

  const [documentDetails, setDocumentDetails] = useState({
    isPassportVerified: dataViewMore?.isPassportVerified,
    isBankVerified: dataViewMore?.isBankVerified,
    personalInfo: dataViewMore?.personalInfo,
  });
  const [errors, setErrors] = useState({});
  const bankDoc = dataViewMore?.bank?.includes(".pdf");
  const panDoc = dataViewMore?.PANcard?.includes(".pdf");
  // const passportDoc = dataViewMore?.passport?.includes(".pdf");
  const passportDoc = dataViewMore?.passport?.filter((item) => {
    return item.media.includes(".pdf");
  })


  const onChangeAddValue = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setDocumentDetails({ ...documentDetails, [name]: value });
    } else if (
      name === "isBankVerified" ||
      name === "isPassportVerified" ||
      name === "personalInfo"
    ) {
      let val = value === "true" ? true : false;
      setDocumentDetails({ ...documentDetails, [name]: val });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleFormValied = () => {
    let errors = {};
    let formValied = true;
    if (documentDetails.isPassportVerified === undefined) {
      formValied = false;
      errors["isPassportVerified"] =
        "Please select either approve or reject for documents.";
    }
    if (documentDetails.isBankVerified === undefined) {
      formValied = false;
      errors["isBankVerified"] =
        "Please select either approve or reject for bank details.";
    }
    if (documentDetails.personalInfo === undefined) {
      formValied = false;
      errors["personalInfo"] =
        "Please select either approve or reject for personal Info.";
    }
    if (
      (documentDetails.isBankVerified === false ||
        documentDetails.isPassportVerified === false ||
        documentDetails?.personalInfo === false) &&
      !documentDetails.description
    ) {
      formValied = false;
      errors["description"] = "please enter the reason of rejection.";
    }
    setErrors(errors);
    return formValied;
  };

  const submitData = async (e) => {
    if (handleFormValied()) {
      let lock =
        documentDetails?.isBankVerified === true &&
          documentDetails?.isPassportVerified === true &&
          documentDetails?.personalInfo === true
          ? true
          : false;
      let data = {
        isBankVerified: documentDetails.isBankVerified,
        isPassportVerified: documentDetails.isPassportVerified,
        personalInfo: documentDetails.personalInfo,
        description: documentDetails.description,
        locked: lock,
        isActive: lock,
      };
      await ApiPut(`admin/approve/${dataViewMore?._id}`, data)
        .then((res) => {
          setDocumentDetails({});
          handleAllInfoClose();
          toast.success(res.data.message);
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const userData = dataViewMore?.bank && dataViewMore?.bankAccountNumber && dataViewMore?.bankName && dataViewMore?.number ? true : false;

  return (
    <div>
      <>
        <div className="all-info-white-banner">
          <div className="page-title-alignment">
            <h3>Personal Information:</h3>
            <div className="first-box-design">
              <div className="first-box-input-grid">
                <div className="input">
                  <label>Residence</label>
                  <input
                    disabled
                    type="text"
                    value={
                      dataViewMore?.nationality === "nri" ? "Non-Indian" : "Indian"
                    }
                  />
                </div>
                <div className="input">
                  <label>Full Name</label>
                  <input
                    disabled
                    type="text"
                    value={dataViewMore?.fullName}
                  />
                </div>
                <div className="input">
                  <label>
                    Date Of Birth<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    disabled
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={dataViewMore?.dob ? moment(dataViewMore?.dob).format("DD/MM/YYYY") : ""}
                  />
                </div>
              </div>
              <div className="button-center-alignment-form">
                {dataViewMore?.personalInfo === false ||
                  dataViewMore?.personalInfo === undefined ? (
                  <div>
                    <button
                      name="personalInfo"
                      value={false}
                      onClick={(e) => onChangeAddValue(e)}
                      className={
                        documentDetails?.personalInfo !== false
                          ? "init-button"
                          : "select-button"
                      }
                    >
                      {documentDetails?.personalInfo !== false
                        ? "Reject"
                        : "Rejected"}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <button
                    disabled={dataViewMore?.personalInfo}
                    name="personalInfo"
                    value={true}
                    onClick={(e) => onChangeAddValue(e)}
                    className={
                      dataViewMore?.personalInfo ||
                        documentDetails?.personalInfo
                        ? "select-button"
                        : "init-button"
                    }
                  >
                    {dataViewMore?.personalInfo ||
                      documentDetails?.personalInfo
                      ? "Approved"
                      : "Approve"}
                  </button>
                </div>
              </div>
              <span
                style={{
                  color: "red",
                  top: "5px",
                  fontSize: "14px",
                }}
              >
                {errors["personalInfo"]}
              </span>
            </div>
          </div>

          <>
            <div className="page-title-alignment">
              <h3>Documents:</h3>
              <div className="first-box-design">
                <div className="first-box-input-grid">
                  <div className="input">
                    <label>
                      {dataViewMore?.dType === "passport" && "Passport No."}
                      {dataViewMore?.dType === "drivingLicense" &&
                        "Driving License No."}
                      {dataViewMore?.dType === "adharCard" &&
                        "Aadhaar Card No."}
                      {!dataViewMore?.dType && "Passport No."}
                    </label>
                    <input
                      disabled
                      type="text"
                      value={dataViewMore?.number}
                    />
                  </div>
                  {dataViewMore?.dType === "passport" && (
                    <div className="input">
                      <label>Place of Issue</label>
                      <input
                        disabled
                        type="text"
                        value={dataViewMore?.placeOfIssue}
                      />
                    </div>
                  )}
                  {dataViewMore?.dType === "passport" ||
                    dataViewMore?.dType === "drivingLicense" ? (
                    <>
                      <div className="input">
                        <label>
                          {dataViewMore?.dType === "passport" &&
                            "Passport Issue Date"}
                          {dataViewMore?.dType === "drivingLicense" &&
                            "Driving License Issue Date"}
                        </label>
                        <input
                          disabled
                          type="text"
                          value={moment(dataViewMore.issueDate).format(
                            "DD/MM/YYYY"
                          )}
                        />
                      </div>
                      <div className="input">
                        <label>
                          {dataViewMore?.dType === "passport" &&
                            "Passport Expiry Date"}
                          {dataViewMore?.dType === "drivingLicense" &&
                            "Driving License Expiry Date"}
                        </label>
                        <input
                          disabled
                          type="text"
                          value={moment(dataViewMore.expiryDate).format(
                            "DD/MM/YYYY"
                          )}
                        />
                      </div>
                    </>
                  ) : null}
                  {dataViewMore?.nationality === "indian" && (
                    <>
                      <div className="input">
                        <label>Pan Card No.</label>
                        <input
                          disabled
                          type="text"
                          value={dataViewMore?.PANnumber}
                        />
                      </div>
                      <div className="input">
                        {panDoc === true ? (
                          <iframe
                            src={dataViewMore?.PANcard}
                            height="250px"
                            width="300px"
                          />
                        ) : (
                          <img
                            src={dataViewMore?.PANcard}
                            alt=""
                            height="250px"
                            width="300px"
                            style={{ marginRight: "10px" }}
                          />
                        )}
                      </div>
                    </>
                  )}
                  <div className="input">
                    {dataViewMore?.passport?.map((data) => (
                      data.media.includes(".pdf") ? (
                        <iframe
                          src={data?.media}
                          height="250px"
                          width="300px"
                          title="document"
                        />
                      ) : (
                        <img
                          src={data?.media}
                          alt=""
                          height="250px"
                          width="300px"
                          style={{ marginRight: "10px" }}
                        />
                      )))}
                  </div>
                </div>
                <div className="button-center-alignment-form">
                  {dataViewMore?.isPassportVerified === false ||
                    dataViewMore?.isPassportVerified === undefined ? (
                    <div>
                      <button
                        name="isPassportVerified"
                        value={false}
                        onClick={(e) => onChangeAddValue(e)}
                        className={
                          documentDetails?.isPassportVerified !== false
                            ? "init-button"
                            : "select-button"
                        }
                      >
                        {documentDetails?.isPassportVerified !== false
                          ? "Reject"
                          : "Rejected"}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <button
                      disabled={dataViewMore?.isPassportVerified}
                      name="isPassportVerified"
                      value={true}
                      onClick={(e) => onChangeAddValue(e)}
                      className={
                        dataViewMore?.isPassportVerified ||
                          documentDetails?.isPassportVerified
                          ? "select-button"
                          : "init-button"
                      }
                    >
                      {dataViewMore?.isPassportVerified ||
                        documentDetails?.isPassportVerified
                        ? "Approved"
                        : "Approve"}
                    </button>
                  </div>
                </div>
                <span
                  style={{
                    color: "red",
                    top: "5px",
                    fontSize: "14px",
                  }}
                >
                  {errors["isPassportVerified"]}
                </span>
              </div>
            </div>
          </>
          <div className="page-title-alignment">
            <h3>Bank Details:</h3>
            <div className="first-box-design">
              <div className="first-box-input-grid">
                <div className="input">
                  <label>
                    {dataViewMore?.nationality === "indian"
                      ? "Bank Name"
                      : "Local Bank Name"}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={dataViewMore?.bankName}
                  />
                </div>
                <div className="input">
                  <label>
                    {dataViewMore?.nationality === "indian"
                      ? "Bank Account no"
                      : "Local Bank Account no"}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={dataViewMore?.bankAccountNumber}
                  />
                </div>
                <div className="input">
                  <label>
                    {dataViewMore?.nationality === "indian"
                      ? "IFSC Code"
                      : "Swift Code"}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={dataViewMore?.bankIfscCode}
                  />
                </div>
                <div className="input">
                  <label>Bank Address</label>
                  <input
                    disabled
                    type="text"
                    value={dataViewMore?.bankAddress}
                  />
                </div>

                <div className="input">
                  {dataViewMore.bank ? (
                    <>
                      <label>Bank Passbook</label>
                      {bankDoc === true ? (
                        <iframe
                          src={dataViewMore?.bank}
                          height="235px"
                          width="300px"
                        />
                      ) : (
                        <img
                          src={dataViewMore?.bank}
                          alt=""
                          height="235px"
                          width="300px"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="button-center-alignment-form">
                {dataViewMore?.isBankVerified === false ||
                  dataViewMore?.isBankVerified === undefined ? (
                  <div>
                    <button
                      name="isBankVerified"
                      value={false}
                      onClick={(e) => onChangeAddValue(e)}
                      className={
                        documentDetails?.isBankVerified !== false
                          ? "init-button"
                          : "select-button"
                      }
                    >
                      {documentDetails?.isBankVerified !== false
                        ? "Reject"
                        : "Rejected"}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <button
                    disabled={dataViewMore?.isBankVerified}
                    name="isBankVerified"
                    value={true}
                    onClick={(e) => onChangeAddValue(e)}
                    className={
                      dataViewMore?.isBankVerified ||
                        documentDetails?.isBankVerified
                        ? "select-button"
                        : "init-button"
                    }
                  >
                    {dataViewMore?.isBankVerified ||
                      documentDetails?.isBankVerified
                      ? "Approved"
                      : "Approve"}
                  </button>
                </div>
              </div>
              <span
                style={{
                  color: "red",
                  top: "5px",
                  fontSize: "14px",
                }}
              >
                {errors["isBankVerified"]}
              </span>
            </div>
          </div>
          <div className="reject-center">
            {(documentDetails.isBankVerified === false ||
              documentDetails.isPassportVerified === false ||
              documentDetails.personalInfo === false) && (
                <div>
                  <p className="rejection-title">
                    Reason of Rejection<span style={{ color: "red" }}>*</span>
                  </p>
                  <textarea
                    placeholder="type here"
                    value={documentDetails?.description}
                    name="description"
                    className="text-area"
                    onChange={(e) => onChangeAddValue(e)}
                  ></textarea>
                  <span
                    style={{
                      color: "red",
                      top: "5px",
                      fontSize: "14px",
                    }}
                  >
                    {errors["description"]}
                  </span>
                </div>
              )}
            {userData === true && (documentDetails.isBankVerified === false ||
              documentDetails.isPassportVerified === false ||
              documentDetails.personalInfo === false) ? (
              <div className="submit-button">
                <button onClick={(e) => submitData(e)}>Submit</button>
              </div>
            ) : userData === true && dataViewMore?.isBankVerified === true &&
              dataViewMore?.isPassportVerified === true &&
              dataViewMore?.personalInfo === true ? (
              <div className="submit-button">
                <button disabled>Approved All Document</button>
              </div>
            ) : userData === true && (
              <div className="submit-button">
                <button onClick={(e) => submitData(e)}>Submit</button>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}

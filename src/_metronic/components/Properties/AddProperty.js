import React from 'react'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { InputTextField } from '../../_helpers/InputTextField';
import AddImage from "./AddImage";
import MapContainer from "./GoogleApiWrapper";
import Multiselect from "multiselect-react-dropdown";
import AddPdf from './AddPdf';

const AddProperty = (props) => {
    const {
        handleOnChangeAdd,
        errorsForAdd,
        inputValueForAdd,
        editQuiz,
        setEditQuiz,
        isOpened,
        toggle,
        getLatLag,
        locationCordinatesData,
        handleOnChnageAddAddress,
        inputValueForAddAdress,
        countryList,
        addStateList,
        formType,
        stateList,
        setErrorsForAdd,
        aboutHome,
        setAboutHome,
        setSelectedTopSubjects,
        allAmenities,
        selectedTopSubjects,
        setEditPdf,
        editPdf,
        loading,
        handelAddPropertyDetails,
        buttonName,

    } = props
    return (
        <>
            <div className="all-content-alignment-properties">
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Type
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <select
                            id="status"
                            name="status"
                            className={`form-control form-control-lg form-control-solid `}
                            onChange={(e) => handleOnChangeAdd(e)}
                            value={inputValueForAdd.status}
                        >
                            <option value="" disabled selected hidden>
                                Select Type Of Property
                            </option>
                            <option value="Villa">Villa</option>
                            <option value="Apartment">Apartment</option>
                        </select>

                        <span className="errors" >
                            {errorsForAdd["status"]}
                        </span>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        No. of Owners
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <select
                            id="ownership"
                            name="ownership"
                            value={inputValueForAdd.ownership}
                            className={`form-control form-control-lg form-control-solid `}
                            onChange={(e) => handleOnChangeAdd(e)}
                        >
                            <option value="" disabled selected hidden>
                                Select No. of Owners
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <span className="errors">
                            {errorsForAdd["ownership"]}
                        </span>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Want To Display?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <select
                            id="isDisplay"
                            name="isDisplay"
                            className={`form-control form-control-lg form-control-solid `}
                            onChange={(e) => handleOnChangeAdd(e)}
                            value={inputValueForAdd?.isDisplay}
                        >
                            <option value="" disabled selected hidden>
                                what you want Display or hide please select?
                            </option>
                            <option value={true}>Display</option>
                            <option value={false}>Hide</option>
                        </select>
                        <span className="errors">
                            {errorsForAdd["isDisplay"]}
                        </span>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Total Assets Value
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <div className="number-input-grid">
                            <div>
                                <input
                                    type="number"
                                    className={`form-control form-control-lg form-control-solid `}
                                    id="wholeHomePrice"
                                    name="wholeHomePrice"
                                    onChange={(e) => {
                                        handleOnChangeAdd(e);
                                    }}
                                    onKeyDown={(evt) =>
                                        evt.key === "e" ||
                                        (evt.key === "-" && evt.preventDefault())
                                    }
                                    min="0"
                                    maxlength={10}
                                    onInput={(e) => {
                                        if (e.target.value[0] === ".")
                                            e.target.value =
                                                parseFloat("0.").toString().slice(0, 10) +
                                                e.target.value.toString().slice(0, 10);
                                    }}
                                    value={inputValueForAdd.wholeHomePrice}
                                />{" "}
                            </div>
                            <div>
                                <div
                                    id="priceType"
                                    name="priceType"
                                    className={`form-control form-control-lg form-control-solid `}
                                    onChange={(e) => handleOnChangeAdd(e)}
                                >
                                    <span>Lakh</span>
                                </div>
                            </div>
                        </div>
                        <span className="errors" >
                            {errorsForAdd["wholeHomePrice"]}
                        </span>
                    </div>
                </div>
                <InputTextField
                    label="Property Name"
                    type="text"
                    name="propertyname"
                    value={inputValueForAdd.propertyname}
                    onChange={(e) => handleOnChangeAdd(e)}
                    error={errorsForAdd["propertyname"]}
                />

                <InputTextField
                    label="Rental Yield (%)"
                    type="text"
                    name="rentalYield"
                    value={inputValueForAdd.rentalYield}
                    onChange={(e) => handleOnChangeAdd(e)}
                    onKeyDown={(evt) =>
                        evt.key === "e" ||
                        (evt.key === "-" && evt.preventDefault())
                    }
                    min="0"
                    maxlength={10}
                    onInput={(e) => {
                        if (e.target.value[0] === ".")
                            e.target.value =
                                parseFloat("0.").toString().slice(0, 10) +
                                e.target.value.toString().slice(0, 10);
                    }}
                    error={errorsForAdd["rentalYield"]}
                />
                <InputTextField
                    label="Expected ROI (%)"
                    type="text"
                    name="expectedIOR"
                    value={inputValueForAdd.expectedIOR}
                    onChange={(e) => handleOnChangeAdd(e)}
                    onKeyDown={(evt) =>
                        evt.key === "e" ||
                        (evt.key === "-" && evt.preventDefault())
                    }
                    min="0"
                    maxlength={10}
                    onInput={(e) => {
                        if (e.target.value[0] === ".")
                            e.target.value =
                                parseFloat("0.").toString().slice(0, 10) +
                                e.target.value.toString().slice(0, 10);
                    }}
                    error={errorsForAdd["expectedIOR"]}
                />

                <InputTextField
                    label="Expected Rental per year"
                    type="text"
                    name="expectedRentalPerYear"
                    value={inputValueForAdd.expectedRentalPerYear}
                    onChange={(e) => handleOnChangeAdd(e)}
                    onKeyDown={(evt) =>
                        evt.key === "e" ||
                        (evt.key === "-" && evt.preventDefault())
                    }
                    min="0"
                    maxlength={10}
                    onInput={(e) => {
                        if (e.target.value[0] === ".")
                            e.target.value =
                                parseFloat("0.").toString().slice(0, 10) +
                                e.target.value.toString().slice(0, 10);
                    }}
                    error={errorsForAdd["expectedRentalPerYear"]}
                />

                <InputTextField
                    label="Expected Exit Value"
                    type="text"
                    name="expectedExitValue"
                    value={inputValueForAdd.expectedExitValue}
                    onChange={(e) => handleOnChangeAdd(e)}
                    onKeyDown={(evt) =>
                        evt.key === "e" ||
                        (evt.key === "-" && evt.preventDefault())
                    }
                    min="0"
                    maxlength={10}
                    onInput={(e) => {
                        if (e.target.value[0] === ".")
                            e.target.value =
                                parseFloat("0.").toString().slice(0, 10) +
                                e.target.value.toString().slice(0, 10);
                    }}
                    error={errorsForAdd["expectedExitValue"]}
                />
                <InputTextField
                    label="Number Of Beds"
                    type="number"
                    name="beds"
                    value={inputValueForAdd.beds}
                    onChange={(e) => handleOnChangeAdd(e)}
                    error={errorsForAdd["beds"]}
                />

                <InputTextField
                    label="Number Of Baths"
                    type="number"
                    name="baths"
                    value={inputValueForAdd.baths}
                    onChange={(e) => handleOnChangeAdd(e)}
                    error={errorsForAdd["baths"]}
                />
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Property Image <br /> (size: 860px x 648px)
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <AddImage
                            coursesEdit={editQuiz}
                            accept="image/*"
                            getCourses={(courses) => setEditQuiz(courses)}
                        />
                        <span
                            style={{
                                color: "red",
                                top: "5px",
                                fontSize: "12px",
                            }}
                        >
                            {errorsForAdd["image"]}
                        </span>
                    </div>
                </div>

                <InputTextField
                    label="Home sqft"
                    type="number"
                    name="sqft"
                    value={inputValueForAdd.sqft}
                    onChange={(e) => handleOnChangeAdd(e)}
                    error={errorsForAdd["sqft"]}
                />

                {/* <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Enter Location
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        {isOpened && isOpened ? (
                            <button
                                className="select-location-button"
                                onClick={toggle}
                            >
                                Enter manualy Location
                            </button>
                        ) : (
                            <button
                                className="select-location-button"
                                onClick={toggle}
                            >
                                Select Location
                            </button>
                        )}
                    </div>
                </div> */}

                {isOpened && (
                    <>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                Enter Location
                            </label>
                        </div>
                        <div className="form-group">
                            <MapContainer
                                autocomplete
                                onMarkerPosChanged={(data) => {
                                    getLatLag(data);
                                }}
                                google={props.google}
                                center={locationCordinatesData}
                                height="400px"
                                zoom={15}
                            />
                        </div>
                    </>
                )}
                {isOpened && formType === "addProperty" && (
                    <>
                        <InputTextField
                            label="Street"
                            type="text"
                            name="street"
                            value={inputValueForAddAdress.street}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["street"]}
                        />

                        <InputTextField
                            label="City"
                            type="text"
                            name="city"
                            value={inputValueForAddAdress.city}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["city"]}
                        />

                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                Country
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <div>
                                    <select
                                        id="country"
                                        name="country"
                                        className={`form-control form-control-lg form-control-solid `}
                                        onChange={(e) => {
                                            handleOnChnageAddAddress(e);
                                        }
                                        }
                                        value={inputValueForAddAdress.country}
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((country) => (
                                            <option value={country.country}>
                                                {country.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <span className="errors" >
                                    {errorsForAdd["country"]}
                                </span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                State
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <select
                                    id="state"
                                    name="state"
                                    className={`form-control form-control-lg form-control-solid `}
                                    onChange={(e) => {
                                        handleOnChnageAddAddress(e);
                                    }}
                                    value={inputValueForAddAdress.state}
                                >
                                    <option value="">Select State</option>
                                    {addStateList?.length > 0 && addStateList[0]?.states?.map((state) => {
                                        return (
                                            <option value={state}>
                                                {state}
                                            </option>
                                        )
                                    })}
                                </select>
                                <span className="errors">
                                    {errorsForAdd["state"]}
                                </span>
                            </div>
                        </div>

                        <InputTextField
                            label="Pincode"
                            type="text"
                            name="pincode"
                            value={inputValueForAddAdress.pincode}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["pincode"]}
                        />
                    </>
                )}
                {!isOpened && formType === "addProperty" && (
                    <>
                        <InputTextField
                            label="Street"
                            type="text"
                            name="street"
                            value={inputValueForAdd.street}
                            onChange={(e) => handleOnChangeAdd(e)}
                            error={errorsForAdd["street"]}
                        />
                        <InputTextField
                            label="City"
                            type="text"
                            name="city"
                            value={inputValueForAdd.city}
                            onChange={(e) => handleOnChangeAdd(e)}
                            error={errorsForAdd["city"]}
                        />

                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                Country
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <div>
                                    <select
                                        id="country"
                                        name="country"
                                        className={`form-control form-control-lg form-control-solid `}
                                        onChange={(e) => {
                                            handleOnChangeAdd(e);
                                        }
                                        }
                                        value={inputValueForAdd.country}
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((country) => (
                                            <option value={country.country}>
                                                {country.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <span className="errors" >
                                    {errorsForAdd["country"]}
                                </span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                State
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <select
                                    id="state"
                                    name="state"
                                    className={`form-control form-control-lg form-control-solid `}
                                    onChange={(e) => {
                                        handleOnChangeAdd(e);
                                    }}
                                    value={inputValueForAdd.state}
                                >
                                    <option value="">Select State</option>
                                    {addStateList?.length > 0 && addStateList[0]?.states?.map((state) => {
                                        return (
                                            <option value={state}>
                                                {state}
                                            </option>
                                        )
                                    })}
                                </select>
                                <span className="errors">
                                    {errorsForAdd["state"]}
                                </span>
                            </div>
                        </div>
                        <InputTextField
                            label="Pincode"
                            type="number"
                            name="pincode"
                            value={inputValueForAdd.pincode}
                            onChange={(e) => handleOnChangeAdd(e)}
                            error={errorsForAdd["pincode"]}
                        />
                    </>
                )}
                <span className="errors" >
                    {errorsForAdd["markers"]}
                </span>
                {formType === "updateProperty" && (
                    <>
                        <InputTextField
                            label="Street"
                            type="text"
                            name="street"
                            value={inputValueForAddAdress.street}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["street"]}
                        />

                        <InputTextField
                            label="City"
                            type="text"
                            name="city"
                            value={inputValueForAddAdress.city}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["city"]}
                        />

                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                Country
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <div>
                                    <select
                                        className={"form-control form-control-lg form-control-solid"}
                                        name="country"
                                        value={inputValueForAddAdress.country}
                                        onChange={(e) => handleOnChnageAddAddress(e)}
                                        error={errorsForAdd["country"]}
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((country) => {
                                            return (
                                                <option key={country.id} value={country.country}>
                                                    {country.country}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <span className="errors">
                                    {errorsForAdd["country"]}
                                </span>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">
                                State
                            </label>
                            <div className="col-lg-9 col-xl-6">
                                <div>
                                    <select
                                        className={"form-control form-control-lg form-control-solid"}
                                        name="state"
                                        value={inputValueForAddAdress.state}
                                        onChange={(e) => handleOnChnageAddAddress(e)}
                                        error={errorsForAdd["country"]}
                                    >
                                        <option value="">Select State</option>
                                        {stateList?.length > 0 && stateList[0]?.states?.map((state) => {
                                            return (
                                                <option value={state}>
                                                    {state}

                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <span className="errors">
                                    {errorsForAdd["state"]}
                                </span>
                            </div>
                        </div>

                        <InputTextField
                            label="Pincode"
                            type="number"
                            name="pincode"
                            value={inputValueForAddAdress.pincode}
                            onChange={(e) => handleOnChnageAddAddress(e)}
                            error={errorsForAdd["pincode"]}
                        />

                    </>
                )}
                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Want To Display Map?
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <select
                            id="isMapDisplay"
                            name="isMapDisplay"
                            className={`form-control form-control-lg form-control-solid `}
                            onChange={(e) => handleOnChangeAdd(e)}
                            value={inputValueForAdd.isMapDisplay}
                        >
                            <option value="" disabled selected hidden>
                                you want display map or hide please select?
                            </option>
                            <option value={true}>Display</option>
                            <option value={false}>Hide</option>
                        </select>
                        <span className="errors" >
                            {errorsForAdd["isMapDisplay"]}
                        </span>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        About Home
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <CKEditor
                            editor={ClassicEditor}
                            data={aboutHome}
                            value={inputValueForAdd.aboutHome}
                            onChange={(aboutHomeData, editor) => {
                                setAboutHome(editor.getData());
                                // setErrorsForAdd({ ...errorsForAdd, aboutHome: "" });
                            }}
                        />
                        <span className="errors">
                            {errorsForAdd["aboutHome"]}
                        </span>
                    </div>
                </div>

                {formType === "addProperty" && (
                    <div className="form-group row">
                        <label className="col-xl-3 col-lg-3 col-form-label">
                            Select Amenities
                        </label>

                        <div className="col-lg-9 col-xl-6">
                            <Multiselect
                                options={allAmenities}
                                onSelect={(selectedList, selectedItem) => {
                                    setSelectedTopSubjects(selectedList);
                                    setErrorsForAdd({
                                        ...errorsForAdd,
                                        selectedTopSubjects: "",
                                    });
                                }}
                                onRemove={(selectedList, removedItem) => {
                                    setSelectedTopSubjects(selectedList);
                                }}
                                displayValue="name"
                            />

                            <span className="errors" >
                                {errorsForAdd["selectedTopSubjects"]}
                            </span>
                        </div>
                    </div>
                )}

                {formType === "updateProperty" && (
                    <div className="form-group row">
                        <label className="col-xl-3 col-lg-3 col-form-label">
                            Select Ameninties
                        </label>

                        <div className="col-lg-9 col-xl-6">
                            <Multiselect
                                options={allAmenities}
                                onSelect={(selectedList, selectedItem) => {
                                    setSelectedTopSubjects(selectedList);
                                    setErrorsForAdd({
                                        ...errorsForAdd,
                                        selectedTopSubjects: "",
                                    });
                                }}
                                onRemove={(selectedList, removedItem) => {
                                    setSelectedTopSubjects(selectedList);
                                }}
                                displayValue="name"
                                selectedValues={selectedTopSubjects}
                            />

                            <span className="errors">
                                {errorsForAdd["selectedTopSubjects"]}
                            </span>
                        </div>
                    </div>
                )}

                <InputTextField
                    label="Crew Contact"
                    type="number"
                    name="crewContact"
                    value={inputValueForAdd.crewContact}
                    onChange={(e) => handleOnChangeAdd(e)}
                    error={errorsForAdd["crewContact"]}
                />

                <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                        Video Of Property
                    </label>
                    <div className="col-lg-9 col-xl-6">
                        <div>
                            <AddPdf
                                coursesEdit={editPdf}
                                accept="*"
                                getCourses={(courses) => setEditPdf(courses)}
                            />
                        </div>
                        <span className="errors" >
                            {errorsForAdd["propertyVideo"]}
                        </span>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                    <button
                        onClick={(e) => {
                            handelAddPropertyDetails(e);
                        }}
                        className="btn btn-success mr-2"
                    >
                        <span>{buttonName}</span>
                        {loading && (
                            <span className="mx-3 spinner spinner-white"></span>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddProperty

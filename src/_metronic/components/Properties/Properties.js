import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "./columnDesign";
import ViewProperty from "./ViewProperty";
import { ApiGet, ApiDelete, ApiPut, ApiPost, } from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import { getLatLongFromAddress } from "./GoogleApiWrapper";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { getUserInfo } from "../../../../src/utils/user.util";
import { useLoadScript } from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import AwsConfig from "../../../config/BucketConfig/BucketConfig";
import S3 from "react-aws-s3";
import countryData from "../../../helpers/country.json";
import AddProperty from "./AddProperty";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultLocation = {
  lat: 21.17024,
  lng: 72.831062,
};

const Properties = (props) => {
  const countryList = countryData?.countries
  const [locationCordinatesData, setLocationCordinatesData] = useState(defaultLocation);
  const userInfo = getUserInfo();
  const [filteredProperties, setFilteredProperties] = useState({});
  const [selectedTopSubjects, setSelectedTopSubjects] = useState([]);
  const [dataViewMore, setDataViewMore] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editQuiz, setEditQuiz] = useState([]);
  const [editPdf, setEditPdf] = useState([]);

  const [isUpdateProperties, setIsUpdateProperties] = useState(false);
  const [isAddProperties, setIsAddProperties] = useState(false);
  const [isViewMoreProperties, setIsViewMoreProperties] = useState(false);
  const [idForUpdatePropertiesData, setIdForUpdatePropertiesData] =
    useState("");
  const [allAmenities, setAllAmenities] = useState([]);
  const [aboutHome, setAboutHome] = useState("");
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [inputValueForAddImage, setInputValueForAddImage] = useState({});
  const [inputValueForAddAdress, setInputValueForAddAdress] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForDeleteProperties, setIdForDeleteProperties] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [idForUpdatePropertyStatus, setIdForUpdatePropertyStatus] =
    useState("");
  const [statusDisplay, setStatusDisplay] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const stateList = countryList?.filter((item) => item?.country === inputValueForAddAdress?.country);
  const addStateList = countryList?.filter((item) => item?.country === inputValueForAdd.country);

  const getLatLongData = async (pincode) => {
    let latLongRes = await getLatLongFromAddress(pincode);
    if (
      latLongRes?.status === "OK" &&
      latLongRes?.results?.[0]?.geometry?.location
    ) {
      setLocationCordinatesData(latLongRes?.results?.[0]?.geometry?.location);
    } else {
      setLocationCordinatesData(defaultLocation);
    }
  };
  useEffect(() => {
    if (
      !isOpened &&
      inputValueForAdd &&
      inputValueForAdd.pincode &&
      inputValueForAdd.pincode?.toString().length === 6
    ) {
      getLatLongData(inputValueForAdd.pincode);
    }
    if (
      isUpdateProperties &&
      !isOpened &&
      inputValueForAddAdress &&
      inputValueForAddAdress.pincode &&
      inputValueForAddAdress.pincode?.toString().length === 6
    ) {
      getLatLongData(inputValueForAddAdress.pincode);
    }
  }, [inputValueForAdd.pincode, inputValueForAddAdress.pincode]);

  const handleOnChangeAdd = (e) => {
    const { name, value } = e.target;

    if (name === "beds" || name === "baths" || name === "sqft") {
      let val = value.replace(/\D/g, "");
      setInputValueForAdd({ ...inputValueForAdd, [name]: val });
    } else if (name === "state" || name === "country") {
      let val = value.charAt(0).toUpperCase() + value.slice(1);
      setInputValueForAdd({ ...inputValueForAdd, [name]: val });
    } else {
      setInputValueForAdd({ ...inputValueForAdd, [name]: value });
    }
    setErrorsForAdd({ ...errorsForAdd, [name]: "" });
  };

  useEffect(() => {
    getAmenities();
  }, []);

  const handleOnChnageAddAddress = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      let val = value.replace(/\D/g, "");
      setInputValueForAddAdress({ ...inputValueForAddAdress, [name]: val });
      setErrorsForAdd({ ...errorsForAdd, [name]: "" });
    } else if (name === "state" || name === "country") {
      let val = value.charAt(0).toUpperCase() + value.slice(1);
      setInputValueForAddAdress({ ...inputValueForAddAdress, [name]: val });
      setErrorsForAdd({ ...errorsForAdd, [name]: "" });

    } else {
      setInputValueForAddAdress({ ...inputValueForAddAdress, [name]: value });
      setErrorsForAdd({ ...errorsForAdd, [name]: "" });
    }
  };

  useEffect(() => {
    props.title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = props.title)
      : (document.title = "Properties | OUR LEISURE HOME");
  }, []);

  const handleUpdatePropertyClose = () => {
    setIsUpdateProperties(false);
    setAboutHome([]);
    setInputValueForAddAdress({});
    setInputValueForAdd({});
    setSelectedTopSubjects([]);
    setErrorsForAdd({});
    setInputValueForAddImage({});
  };

  const handleAddAdminClose = () => {
    setIsAddProperties(false);
    setAboutHome([]);
    setInputValueForAddAdress([]);
    setInputValueForAdd([]);
    setSelectedTopSubjects([]);
    setErrorsForAdd({});
    setInputValueForAddImage({});
    setIsOpened(false);
  };

  const handleViewMoreClose = () => {
    setIsViewMoreProperties(false);
    setDataViewMore({});
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCloseShowStatus = () => {
    setShowStatus(false);
  };

  useEffect(() => {
    getAllProperties();
  }, [page, countPerPage]);

  const getAllProperties = async () => {
    setIsLoaderVisible(true);
    if (userInfo?.admin?.role === "superadmin") {
      if (!search) {
        await ApiPost(
          `property/getPropertys?page=${page}&limit=${countPerPage}`
        )
          .then((res) => {
            setIsLoaderVisible(false);
            setFilteredProperties(res?.data?.payload?.data);
            setCount(res?.data?.payload?.dataCount);
          })
          .catch((err) => {
            toast.error(err?.message);
          });
      } else {
        await ApiPost(
          `property/getPropertys?search=${search}&page=${page}&limit=${countPerPage}`
        )
          .then((res) => {
            setIsLoaderVisible(false);
            setFilteredProperties(res?.data?.payload?.data);
            setCount(res?.data?.payload?.dataCount);
          })
          .catch((err) => {
            toast.error(err?.message);
          });
      }
    } else {
      if (!search) {
        let Data = {
          aid: userInfo?.admin?.id,
        };
        await ApiPost(
          `property/getPropertys?page=${page}&limit=${countPerPage}`,
          Data
        )
          .then((res) => {
            setIsLoaderVisible(false);
            setFilteredProperties(res?.data?.payload?.data);
            setCount(res?.data?.payload?.dataCount);
          })
          .catch((err) => {
            toast.error(err?.message);
          });
      } else {
        let Data = {
          aid: userInfo?.admin?.id,
        };
        await ApiPost(
          `property/getPropertys?search=${search}&page=${page}&limit=${countPerPage}`,
          Data
        )
          .then((res) => {
            setIsLoaderVisible(false);
            setFilteredProperties(res?.data?.payload?.data);
            setCount(res?.data?.payload?.dataCount);
          })
          .catch((err) => {
            toast.error(err?.message);
          });
      }
    }
  };

  const getAmenities = () => {
    ApiGet(`amenities/getAmenities?limit=1000&type=DISTINCTIVE`)
      .then((res) => {
        if (res?.data?.payload && res?.status === 200) {
          setAllAmenities(res.data.payload?.Ameninties);
        }
      })
      .catch((err) => {
        toast.error(err?.message, { theme: "colored" });
      });
  };

  const validateFormForAddAdmin = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    let filter = editQuiz.filter((e) => Boolean(e.imgPath) === false);
    if (filter.length) {
      formIsValid = false;
      errorsForAdd["image"] = "*Please select image!!";
    } else if (editQuiz.length < 7) {
      formIsValid = false;
      errorsForAdd["image"] = "*minimum 7 images are required!";
    }
    if (!aboutHome) {
      formIsValid = false;
      errorsForAdd["aboutHome"] = "*Please enter about home!";
    }
    // let filter1 = editPdf.filter(e => Boolean(e.pdfPath) === false);
    // if (filter1.length) {
    //   formIsValid = false;
    //   errorsForAdd["document"] = "*Please select pdf!!";
    // } else if (!editPdf.length) {
    //   formIsValid = false;
    //   errorsForAdd["document"] = "*pdf are required!";
    // }
    if (inputValueForAdd && !inputValueForAdd.baths) {
      formIsValid = false;
      errorsForAdd["baths"] = "*Please enter number of baths!";
    }
    if (inputValueForAdd && !inputValueForAdd?.propertyname) {
      formIsValid = false;
      errorsForAdd["propertyname"] = "*Please enter property name!";
    }
    if (inputValueForAdd && !inputValueForAdd.ownership) {
      formIsValid = false;
      errorsForAdd["ownership"] = "*Please select ownership!";
    }
    // if (inputValueForAdd && !inputValueForAdd.targetIRR) {
    //   formIsValid = false;
    //   errorsForAdd["targetIRR"] = "*Please enter target IRR!";
    // }
    if (inputValueForAdd && !inputValueForAdd.expectedExitValue) {
      formIsValid = false;
      errorsForAdd["expectedExitValue"] = "*Please enter expected exit value!";
    }
    if (inputValueForAdd && !inputValueForAdd.expectedIOR) {
      formIsValid = false;
      errorsForAdd["expectedIOR"] = "*Please enter expected ROI!";
    }
    if (inputValueForAdd && !inputValueForAdd.expectedRentalPerYear) {
      formIsValid = false;
      errorsForAdd["expectedRentalPerYear"] = "*Please enter expected rental per year!";
    }
    if (inputValueForAdd && !inputValueForAdd.rentalYield) {
      formIsValid = false;
      errorsForAdd["rentalYield"] = "*Please enter rental yield!";
    }
    if (inputValueForAdd && !inputValueForAdd.sqft) {
      formIsValid = false;
      errorsForAdd["sqft"] = "*Please enter sqft!";
    }
    if (inputValueForAdd && !inputValueForAdd.beds) {
      formIsValid = false;
      errorsForAdd["beds"] = "*Please enter number of beds!";
    }
    // if (inputValueForAdd && !inputValueForAdd.bath) {
    //   formIsValid = false;
    //   errorsForAdd["bath"] = "*Please enter number of bath!";
    // }
    if (inputValueForAdd && !inputValueForAdd.status) {
      formIsValid = false;
      errorsForAdd["status"] = "*Please select status!";
    }
    if (inputValueForAdd && !inputValueForAdd.wholeHomePrice) {
      formIsValid = false;
      errorsForAdd["wholeHomePrice"] = "*Please enter Total Assets Value!";
    }
    if (isOpened && inputValueForAddAdress && !inputValueForAddAdress.street) {
      formIsValid = false;
      errorsForAdd["street"] = "*Please enter street name!";
    }
    if (isOpened && inputValueForAddAdress && !inputValueForAddAdress.city) {
      formIsValid = false;
      errorsForAdd["city"] = "*Please enter city name!";
    }
    if (isOpened && inputValueForAddAdress && !inputValueForAddAdress.state) {
      formIsValid = false;
      errorsForAdd["state"] = "*Please enter state name!";
    }
    if (isOpened && inputValueForAddAdress && !inputValueForAddAdress.country) {
      formIsValid = false;
      errorsForAdd["country"] = "*Please enter country name!";
    }
    if (isOpened && inputValueForAddAdress && !inputValueForAddAdress.pincode) {
      formIsValid = false;
      errorsForAdd["pincode"] = "*Please enter pincode!";
    }
    if (!isOpened && inputValueForAdd && !inputValueForAdd.street) {
      formIsValid = false;
      errorsForAdd["street"] = "*Please enter street name!";
    }
    if (!isOpened && inputValueForAdd && !inputValueForAdd.city) {
      formIsValid = false;
      errorsForAdd["city"] = "*Please enter city name!";
    }
    if (!isOpened && inputValueForAdd && !inputValueForAdd.state) {
      formIsValid = false;
      errorsForAdd["state"] = "*Please enter state name!";
    }
    if (!isOpened && inputValueForAdd && !inputValueForAdd.country) {
      formIsValid = false;
      errorsForAdd["country"] = "*Please enter country name!";
    }
    if (
      !isOpened &&
      inputValueForAdd &&
      inputValueForAdd.pincode &&
      inputValueForAdd.pincode?.toString().length !== 6
    ) {
      formIsValid = false;
      errorsForAdd["pincode"] = "*Please enter valid pincode!";
    }
    if (!isOpened && inputValueForAdd && !inputValueForAdd.pincode) {
      formIsValid = false;
      errorsForAdd["pincode"] = "*Please enter pincode!";
    }
    if (inputValueForAdd && !inputValueForAdd.isMapDisplay) {
      formIsValid = false;
      errorsForAdd["isMapDisplay"] = "*Please select want to display map";
    }
    if (inputValueForAdd && !inputValueForAdd.isMapDisplay) {
      formIsValid = false;
      errorsForAdd["isDisplay"] = "*Please select want to display Property";
    }
    if (inputValueForAdd && !inputValueForAdd.crewContact) {
      formIsValid = false;
      errorsForAdd["crewContact"] = "*Please enter phone number!";
    } else if (
      inputValueForAdd.crewContact &&
      !inputValueForAdd.crewContact.match(/^\d{10}$/)
    ) {
      formIsValid = false;
      errorsForAdd["crewContact"] = "*Please enter vaild phone number!";
    }
    if (selectedTopSubjects?.length === 0) {
      formIsValid = false;
      errorsForAdd["selectedTopSubjects"] = "*Please select amenity!";
    }
    if (formIsValid === false) {
      toast.error("Please fill required field");
    }
    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handelAddPropertyDetails = async (e) => {
    if (validateFormForAddAdmin()) {
      let pdfForAdd = await getPdfArrayFromUpload();
      let photosForAdd = await getImageArrayFromUpload();
      const newArray = [];
      {
        selectedTopSubjects.map((sub, i) => {
          newArray.push(sub._id);
        });
      }
      let Data = {
        adminid: userInfo?.admin?.id,
        baths: inputValueForAdd?.baths,
        beds: inputValueForAdd?.beds,
        ownership: inputValueForAdd?.ownership,
        // targetIRR: inputValueForAdd?.targetIRR,
        rentalYield: inputValueForAdd?.rentalYield,
        expectedIOR: inputValueForAdd?.expectedIOR,
        expectedRentalPerYear: inputValueForAdd?.expectedRentalPerYear,
        expectedExitValue: inputValueForAdd?.expectedExitValue,
        isDisplay: inputValueForAdd?.isDisplay,
        sqft: inputValueForAdd?.sqft,
        status: inputValueForAdd?.status,
        wholeHomePrice: inputValueForAdd?.wholeHomePrice,
        priceType: "Lakh",
        address: {
          name: inputValueForAdd?.propertyname
            ? inputValueForAdd?.propertyname
            : inputValueForAdd?.propertyname,
          street: inputValueForAdd?.street
            ? inputValueForAdd?.street
            : inputValueForAddAdress?.street,
          city: inputValueForAdd?.city
            ? inputValueForAdd?.city
            : inputValueForAddAdress?.city,
          state: inputValueForAdd?.state
            ? inputValueForAdd?.state
            : inputValueForAddAdress?.state,
          country: inputValueForAdd?.country
            ? inputValueForAdd?.country
            : inputValueForAddAdress?.country,
          pincode: inputValueForAdd?.pincode
            ? inputValueForAdd?.pincode
            : inputValueForAddAdress?.pincode,
        },
        location: {
          lat: locationCordinatesData.lat,
          lng: locationCordinatesData.lng,
        },
        isMapDisplay: inputValueForAdd.isMapDisplay,
        aboutHome: aboutHome,
        amenities: newArray,
        crewContact: inputValueForAdd.crewContact,
        property360: inputValueForAdd.property360,
      };
      Data["photos"] = photosForAdd;
      Data["propertyVideo"] = pdfForAdd[0]?.videoPath !== "" ? pdfForAdd : [];

      await ApiPost(`property/addProperty`, Data)
        .then((res) => {
          handleAddAdminClose()
          toast.success("Property Added Successfully");
          getAllProperties();
          {
            document.title === "Dashboard | OUR LEISURE HOME" &&
              props.getNewCount();
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const uploadS3bucket = async (file) => {
    let config = AwsConfig;
    config = {
      ...config,
      dirName: "Cerificate",
      ACL: "public-read",
    };
    const Reacts3Client = new S3(config);
    let urls;
    let f = file;

    let filename = "AboutImage(" + new Date().getTime() + ")";
    let data = await Reacts3Client.uploadFile(f, filename);
    urls = data.location;
    return urls;
  };

  const getImageArrayFromUpload = async () => {
    let file = editQuiz;
    let photos = [];
    for (let i = 0; i < file?.length; i++) {
      if (typeof file[i].imgPath === "string") {
        photos.push({ imgPath: file[i].imgPath });
      } else {
        let driviniglicencephoto = await uploadS3bucket(file[i].imgPath);
        photos.push({ imgPath: driviniglicencephoto });
      }
    }
    return photos;
  };

  const getPdfArrayFromUpload = async (e) => {
    let file = editPdf;
    let legalDocuments = [];
    for (let i = 0; i < file?.length; i++) {
      if (typeof file[i].videoPath === "string") {
        legalDocuments.push({ videoPath: file[i].videoPath });
      } else {
        let driviniglicencephoto = await uploadS3bucket(file[i].videoPath);
        legalDocuments.push({ videoPath: driviniglicencephoto });
      }
    }
    return legalDocuments;
  };

  const validateForm = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    let filter = editQuiz.filter((e) => Boolean(e.imgPath) === false);
    if (filter.length) {
      formIsValid = false;
      errorsForAdd["image"] = "*Please select image!!";
    } else if (editQuiz.length < 7) {
      formIsValid = false;
      errorsForAdd["image"] = "*minimum 7 images are required!";
    }
    // let filter1 = editPdf.filter(e => Boolean(e.pdfPath) === false);
    // if (filter1.length) {
    //   formIsValid = false;
    //   errorsForAdd["document"] = "*Please select pdf!!";
    // } else if (!editPdf.length) {
    //   formIsValid = false;
    //   errorsForAdd["document"] = "*pdf are required!";
    // }
    if (inputValueForAdd && !inputValueForAdd.baths) {
      formIsValid = false;
      errorsForAdd["baths"] = "*Please enter number of baths!";
    }
    if (!inputValueForAddImage) {
      formIsValid = false;
      errorsForAdd["photos"] = "*Please add image!";
    }
    if (inputValueForAdd && !inputValueForAdd.beds) {
      formIsValid = false;
      errorsForAdd["beds"] = "*Please enter number of beds!";
    }
    if (inputValueForAdd && !inputValueForAdd?.propertyname) {
      formIsValid = false;
      errorsForAdd["propertyname"] = "*Please enter property name!";
    }
    if (inputValueForAdd && !inputValueForAdd.ownership) {
      formIsValid = false;
      errorsForAdd["ownership"] = "*Please enter ownership!";
    }
    // if (inputValueForAdd && !inputValueForAdd.targetIRR) {
    //   formIsValid = false;
    //   errorsForAdd["targetIRR"] = "*Please enter target IRR!";
    // }
    if (inputValueForAdd && !inputValueForAdd.expectedExitValue) {
      formIsValid = false;
      errorsForAdd["expectedExitValue"] = "*Please enter expected exit value!";
    }
    if (inputValueForAdd && !inputValueForAdd.expectedIOR) {
      formIsValid = false;
      errorsForAdd["expectedIOR"] = "*Please enter expected ROI!";
    }
    if (inputValueForAdd && !inputValueForAdd.expectedRentalPerYear) {
      formIsValid = false;
      errorsForAdd["expectedRentalPerYear"] =
        "*Please enter expected rental per year!";
    }
    if (inputValueForAdd && !inputValueForAdd.rentalYield) {
      formIsValid = false;
      errorsForAdd["rentalYield"] = "*Please enter rental yield!";
    }
    if (inputValueForAdd && !inputValueForAdd.sqft) {
      formIsValid = false;
      errorsForAdd["sqft"] = "*Please enter sqft!";
    }
    if (inputValueForAdd && !inputValueForAdd.status) {
      formIsValid = false;
      errorsForAdd["status"] = "*Please Select status!";
    }
    if (inputValueForAdd && !inputValueForAdd.wholeHomePrice) {
      formIsValid = false;
      errorsForAdd["wholeHomePrice"] = "*Please enter Total Assets Value!";
    }
    if (inputValueForAddAdress && !inputValueForAddAdress.street) {
      formIsValid = false;
      errorsForAdd["street"] = "*Please enter street name!";
    }
    if (inputValueForAddAdress && !inputValueForAddAdress.city) {
      formIsValid = false;
      errorsForAdd["city"] = "*Please enter city name!";
    }
    if (inputValueForAddAdress && !inputValueForAddAdress.state) {
      formIsValid = false;
      errorsForAdd["state"] = "*Please enter state name!";
    }
    if (inputValueForAddAdress && !inputValueForAddAdress.country) {
      formIsValid = false;
      errorsForAdd["country"] = "*Please enter country name!";
    }
    if (inputValueForAddAdress && !inputValueForAddAdress.pincode) {
      formIsValid = false;
      errorsForAdd["pincode"] = "*Please enter pincode!";
    }
    if (inputValueForAdd && !inputValueForAdd.isMapDisplay) {
      formIsValid = false;
      errorsForAdd["isMapDisplay"] = "*Please select want to display map";
    }
    // if (!inputValueForAdd?.isDisplay === true || !inputValueForAdd.isDisplay === false) {
    //   formIsValid = false;
    //   errorsForAdd["isDisplay"] = "*Please select want to diaplay Property";
    // }
    if (!aboutHome) {
      formIsValid = false;
      errorsForAdd["aboutHome"] = "*Please enter about Home!";
    }
    if (inputValueForAdd && !inputValueForAdd.crewContact) {
      formIsValid = false;
      errorsForAdd["crewContact"] = "*Please enter Phone Number!";
    } else if (
      inputValueForAdd.crewContact &&
      !inputValueForAdd.crewContact.match(/^\d{10}$/)
    ) {
      formIsValid = false;
      errorsForAdd["crewContact"] = "*Please enter vaild phone number!";
    }
    if (!selectedTopSubjects?.length) {
      formIsValid = false;
      errorsForAdd["selectedTopSubjects"] = "*Please select amenity!";
    }
    if (formIsValid === false) {
      toast.error("Please fill required field");
    }
    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handelUpdatePropertyDetails = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let photosForAdd = await getImageArrayFromUpload();
      let pdfForAdd = await getPdfArrayFromUpload();
      const newArray = [];
      {
        selectedTopSubjects.map((sub, i) => {
          newArray.push(sub._id);
        });
      }
      let Data = {
        adminid: userInfo?.admin?.id,
        baths: inputValueForAdd?.baths,
        beds: inputValueForAdd?.beds,
        ownership: inputValueForAdd?.ownership,
        rentalYield: inputValueForAdd?.rentalYield,
        expectedExitValue: inputValueForAdd?.expectedExitValue,
        expectedIOR: inputValueForAdd?.expectedIOR,
        expectedRentalPerYear: inputValueForAdd?.expectedRentalPerYear,
        isDisplay: inputValueForAdd?.isDisplay,
        sqft: inputValueForAdd?.sqft,
        status: inputValueForAdd?.status,
        wholeHomePrice: inputValueForAdd?.wholeHomePrice,
        // priceType: inputValueForAdd?.priceType,
        priceType: "Lakh",
        address: {
          name: inputValueForAdd?.propertyname
            ? inputValueForAdd?.propertyname
            : inputValueForAdd?.propertyname,
          street: inputValueForAdd?.street
            ? inputValueForAdd?.street
            : inputValueForAddAdress?.street,
          city: inputValueForAdd?.city
            ? inputValueForAdd?.city
            : inputValueForAddAdress?.city,
          state: inputValueForAdd?.state
            ? inputValueForAdd?.state
            : inputValueForAddAdress?.state,
          country: inputValueForAdd?.country
            ? inputValueForAdd?.country
            : inputValueForAddAdress?.country,
          pincode: inputValueForAdd?.pincode
            ? inputValueForAdd?.pincode
            : inputValueForAddAdress?.pincode,
        },
        location: {
          lat: locationCordinatesData?.lat,
          lng: locationCordinatesData?.lng,
        },
        isMapDisplay: inputValueForAdd?.isMapDisplay,
        aboutHome: aboutHome,
        amenities: newArray,
        crewContact: inputValueForAdd?.crewContact,
        propertyVideo: inputValueForAdd?.propertyVideo,
      };
      Data["photos"] = photosForAdd;
      Data["propertyVideo"] = pdfForAdd;
      ApiPut(`property/updateProperty/${idForUpdatePropertiesData}`, Data)
        .then((res) => {
          if (res?.status === 200) {
            handleUpdatePropertyClose();
            toast.success("Property updated successfully");
            getAllProperties();
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  const handleUpdateStatusProperty = (status) => {
    ApiPut(`property/updateStatus/${idForUpdatePropertyStatus}`, {
      isDisplay: status,
    })
      .then((res) => {
        if (res?.status === 200) {
          setShowStatus(false);
          toast.success("Status updated Successfully");
          getAllProperties();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleDeleteProperty = () => {
    ApiDelete(`property/deleteProperty/${idForDeleteProperties}`)
      .then((res) => {
        if (res?.status === 200) {
          setShow(false);
          toast.success("Property Deleted Successfully");
          getAllProperties();
          {
            document.title === "Dashboard | OUR LEISURE HOME" &&
              props.getNewCount();
          }
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const columns = [
    {
      name: "SNo",
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width: "65px",
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
    {
      name: "Total Assets Value",
      cell: (row) => {
        return (
          <>
            {row?.wholeHomePrice} {row?.priceType}
          </>
        );
      },
    },
    {
      name: "Baths",
      selector: "baths",
      sortable: true,
    },
    {
      name: "Beds",
      selector: "beds",
      sortable: true,
    },
    {
      name: "Sqft",
      selector: "sqft",
      sortable: true,
    },
    {
      name: "Display?",
      cell: (row) => {
        return (
          <>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowStatus(true);
                setIdForUpdatePropertyStatus(row?._id);
                setStatusDisplay(row?.isDisplay);
              }}
            >
              <Tooltip title="Status Property" arrow>
                <div className="cus-medium-button-style">
                  <button>
                    {row?.isDisplay === true ? "Active" : "Deactive"}
                  </button>
                </div>
              </Tooltip>
            </div>
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  getAmenities();
                  setIsUpdateProperties(true);
                  setDataViewMore(row);
                  setEditQuiz(row?.photos);
                  setEditPdf(row?.propertyVideo);
                  setIdForUpdatePropertiesData(row._id);
                  setInputValueForAdd({
                    adminid: userInfo?.admin?.id,
                    baths: row?.baths,
                    beds: row?.beds,
                    ownership: row?.ownership,
                    // targetIRR: row?.targetIRR,
                    rentalYield: row?.rentalYield,
                    expectedExitValue: row?.expectedExitValue,
                    expectedRentalPerYear: row?.expectedRentalPerYear,
                    expectedIOR: row?.expectedIOR,
                    isDisplay: row?.isDisplay,
                    isMapDisplay: row?.isMapDisplay,
                    shareStatus: row?.shareStatus,
                    sqft: row?.sqft,
                    status: row?.status,
                    wholeHomePrice: row?.wholeHomePrice,
                    priceType: row?.priceType,
                    crewContact: row?.crewContact,
                    property360: row?.property360,
                    propertyname: row?.address?.name,
                    // propertyVideo: row?.propertyVideo,
                  });
                  setInputValueForAddAdress({
                    street: row?.address?.street,
                    city: row?.address?.city,
                    state: row?.address?.state,
                    country: row?.address?.country,
                    pincode: row?.address?.pincode,
                  });
                  setAboutHome(row?.aboutHome)
                  handleUpdateAmienities(row?.amenities);
                  setLocationCordinatesData({
                    lat: row?.location?.coordinates[1],
                    lng: row?.location?.coordinates[0],
                  });
                }}
              >
                <Tooltip title="Edit Property" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
            {/* <div
              className="cursor-pointer"
              onClick={() => {
                setShow(true);
                setIdForDeleteProperties(row?._id);
              }}
            >
              <Tooltip title="Delete Ameninties" arrow>
                <DeleteIcon />
              </Tooltip>
            </div> */}
            <div
              className="cursor-pointer pl-2"
              onClick={() => {
                setIsViewMoreProperties(true);
                setDataViewMore(row);
              }}
            >
              <Tooltip title="Show More" arrow>
                <InfoOutlinedIcon />
              </Tooltip>
            </div>
          </>
        );
      },
    },
  ];


  const handleUpdateAmienities = (amenities) => {
    let filteredAminites = allAmenities?.filter((item) => {
      return amenities?.includes(item?._id);
    });
    setSelectedTopSubjects(filteredAminites)
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearchTerm = useDebounce(search, 500);
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoaderVisible(true);
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllProperties();
    }
  }, [debouncedSearchTerm]);

  //for map integration

  const libraries = ["places"];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });

  const getLatLag = React.useCallback((data) => {
    var stateCopy = Object.assign({});

    let cordinatesData = {
      lng: data.latlng && data.latlng.lng,
      lat: data.latlng && data.latlng.lat,
    };
    stateCopy.address = data.address;
    stateCopy.buildingNo = data.streetNumber;
    stateCopy.country = data.country;
    stateCopy.state = data.province;
    stateCopy.city = data.city;
    stateCopy.zipCode = data.ZipCode;
    let bodyAddress = {
      street: data?.address,
      city: data.city,
      state: data.province,
      country: data.country,
      pincode: data.ZipCode,
    };
    setLocationCordinatesData(cordinatesData);
    setInputValueForAddAdress({ ...bodyAddress });
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }

  return (
    <>
      <div className="card p-1">
        <ToastContainer />
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Properties Listing</h2>
            </div>
            <div className="col-md-7 col-sm-12 mobile-view-align">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search Properties"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
            <div className="col-md-2 cus-medium-button-style button-height mobile-button-center-align mobile-view-align">
              <button
                onClick={() => {
                  setIsAddProperties(true);
                  getAmenities();
                }}
              >
                Add Property
              </button>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are You Sure To Want To delete this Amenintie
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteProperty();
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          {/* end delete model */}

          {/* Status model */}
          <Modal show={showStatus} onHide={handleCloseShowStatus}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to{" "}
              {statusDisplay === true ? "de-active" : "active"} this property ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseShowStatus}>
                cancel
              </Button>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleUpdateStatusProperty(!statusDisplay);
                }}
              >
                {statusDisplay === true ? "De-active" : "Active"}
              </Button>
            </Modal.Footer>
          </Modal>
          <DataTable
            columns={columns}
            data={filteredProperties}
            customStyles={customStyles}
            style={{
              marginTop: "-3rem",
              marginRight: "-3rem",
            }}
            progressPending={isLoaderVisible}
            progressComponent={
              <Loader type="Puff" color="#334D52" height={30} width={30} />
            }
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={count}
            paginationPerPage={countPerPage}
            paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
            paginationDefaultPage={page}
            onChangePage={(page) => {
              setPage(page);
            }}
            onChangeRowsPerPage={(rowPerPage) => {
              setCountPerPage(rowPerPage);
            }}
          />
        </div>
      </div>
      {isAddProperties ? (
        <Dialog
          fullScreen
          open={isAddProperties}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <List>
            <AddProperty
              handleOnChangeAdd={handleOnChangeAdd}
              inputValueForAdd={inputValueForAdd}
              errorsForAdd={errorsForAdd}
              setEditQuiz={setEditQuiz}
              toggle={toggle}
              isOpened={isOpened}
              locationCordinatesData={locationCordinatesData}
              getLatLag={getLatLag}
              inputValueForAddAdress={inputValueForAddAdress}
              handleOnChnageAddAddress={handleOnChnageAddAddress}
              addStateList={addStateList}
              countryList={countryList}
              formType="addProperty"
              setAboutHome={setAboutHome}
              aboutHome={aboutHome}
              setErrorsForAdd={setErrorsForAdd}
              allAmenities={allAmenities}
              setSelectedTopSubjects={setSelectedTopSubjects}
              setEditPdf={setEditPdf}
              loading={loading}
              handelAddPropertyDetails={handelAddPropertyDetails}
              buttonName="Add Details"
            />
          </List>
        </Dialog>
      ) : null}

      {isViewMoreProperties ? (
        <Dialog
          fullScreen
          open={isViewMoreProperties}
          onClose={handleViewMoreClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleViewMoreClose}>
            <CloseIcon />
          </div>
          <List>
            <ViewProperty dataViewMore={dataViewMore} />
          </List>
        </Dialog>
      ) : null}

      {isUpdateProperties ? (
        <Dialog
          fullScreen
          open={isUpdateProperties}
          onClose={handleUpdatePropertyClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleUpdatePropertyClose}>
            <CloseIcon />
          </div>
          <List>
            <AddProperty
              inputValueForAdd={inputValueForAdd}
              handleOnChangeAdd={handleOnChangeAdd}
              errorsForAdd={errorsForAdd}
              editQuiz={editQuiz}
              setEditQuiz={setEditQuiz}
              toggle={toggle}
              isOpened={isOpened}
              addStateList={addStateList}
              countryList={countryList}
              stateList={stateList}
              getLatLag={getLatLag}
              locationCordinatesData={locationCordinatesData}
              inputValueForAddAdress={inputValueForAddAdress}
              handleOnChnageAddAddress={handleOnChnageAddAddress}
              formType="updateProperty"
              setAboutHome={setAboutHome}
              aboutHome={aboutHome}
              setErrorsForAdd={setErrorsForAdd}
              selectedTopSubjects={selectedTopSubjects}
              allAmenities={allAmenities}
              setSelectedTopSubjects={setSelectedTopSubjects}
              setEditPdf={setEditPdf}
              editPdf={editPdf}
              handelAddPropertyDetails={handelUpdatePropertyDetails}
              buttonName="Update Details"
            />
          </List>
        </Dialog>
      ) : null}
    </>
  );
};
export default Properties;

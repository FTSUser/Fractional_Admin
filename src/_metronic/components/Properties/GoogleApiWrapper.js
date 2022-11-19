import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
Geocode.enableDebug();

export const getLatLongFromAddress = async (Address) => {
  let addressRes = await Geocode.fromAddress(Address).then((res) => {
    return res
  }).catch((err) => {
    return err
  });
  return addressRes
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      area: "",
      state: "",
      country: "",
      ZipCode: "",
      streetNumber: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */

  componentDidMount() {
    Geocode.fromLatLng(this.props.center.lat, this.props.center.lng).then(
      (response) => {
        const address = response.results[ 0 ].formatted_address,
          addressArray = response.results[ 0 ].address_components,
          city = this.getCity(addressArray),
          country = this.getCountry(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray),
          ZipCode = this.getZipCode(addressArray),
          streetNumber = this.getStreetnumber(addressArray);

        this.setState(
          {
            address: address ? address : "",
            streetNumber: streetNumber ? streetNumber : "",
            area: area ? area : "",
            city: city ? city : "",
            country: country ? country : "",
            state: state ? state : "",
            ZipCode: ZipCode ? ZipCode : "",
            markerPosition: {
              lat: this.props.center.lat,
              lng: this.props.center.lng,
            },
            mapPosition: {
              lat: this.props.center.lat,
              lng: this.props.center.lng,
            },
          },
          () => {
            this.onMarkerPosChanged();
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat
      // this.state.address !== nextState.address ||
      // this.state.streetNumber !== nextState.streetNumber ||
      // this.state.city !== nextState.city ||
      // this.state.area !== nextState.area ||
      // this.state.state !== nextState.state ||
      // this.state.country !== nextState.country ||
      // this.state.ZipCode !== nextState.ZipCode
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[ i ].types[ 0 ] &&
        "administrative_area_level_2" === addressArray[ i ].types[ 0 ]
      ) {
        city = addressArray[ i ].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "";
    let area2 = "";

    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if ("route" === addressArray[ i ].types[ 0 ]) {
          area2 = addressArray[ i ].long_name;
        }
      }
    }
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[ i ].types[ 0 ]) {
        for (let j = 0; j < addressArray[ i ].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[ i ].types[ j ] ||
            "locality" === addressArray[ i ].types[ j ]
          ) {
            area = addressArray[ i ].long_name + " " + (area2 ? area2 : "");
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[ i ].types[ 0 ] &&
          "administrative_area_level_1" === addressArray[ i ].types[ 0 ]
        ) {
          state = addressArray[ i ].long_name;
          return state;
        }
      }
    }
  };

  getCountry = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[ i ].types[ 0 ] &&
          "country" === addressArray[ i ].types[ 0 ]
        ) {
          state = addressArray[ i ].long_name;
          return state;
        }
      }
    }
  };

  getStreetnumber = (addressArray) => {
    let streetNumber = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[ i ].types[ 0 ] === "street_number") {
          streetNumber = addressArray[ i ].long_name;
          return streetNumber;
        }
      }
    }
  };

  getZipCode = (addressArray) => {
    let ZipCode = "";
    for (var i = 0; i < addressArray.length; ++i) {
      if (addressArray[ i ].types[ 0 ] == "postal_code") {
        ZipCode = addressArray[ i ].long_name;
        return ZipCode;
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = (event) => {
    this.setState({ [ event.target.name ]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = (event) => { };
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      country = this.getCountry(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      ZipCode = this.getZipCode(addressArray),
      streetNumber = this.getStreetnumber(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState(
      {
        address: address ? address : "",
        streetNumber: streetNumber ? streetNumber : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        country: country ? country : "",
        ZipCode: ZipCode ? ZipCode : "",
        markerPosition: {
          lat: latValue,
          lng: lngValue,
        },
        mapPosition: {
          lat: latValue,
          lng: lngValue,
        },
      },
      () => {
        this.onMarkerPosChanged();
      }
    );
  };
  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[ 0 ].formatted_address,
          addressArray = response.results[ 0 ].address_components,
          city = this.getCity(addressArray),
          country = this.getCountry(addressArray),
          streetNumber = this.getStreetnumber(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray),
          ZipCode = this.getZipCode(addressArray);
        this.setState(
          {
            address: address ? address : "",
            streetNumber: streetNumber ? streetNumber : "",
            country: country ? country : "",
            area: area ? area : "",
            city: city ? city : "",
            state: state ? state : "",
            ZipCode: ZipCode ? ZipCode : "",
            markerPosition: {
              lat: newLat,
              lng: newLng,
            },
            mapPosition: {
              lat: newLat,
              lng: newLng,
            },
          },
          () => {
            this.onMarkerPosChanged();
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  };

  onMarkerPosChanged = () => {
    if (this.props.onMarkerPosChanged != undefined) {
      this.props.onMarkerPosChanged({
        latlng: this.state.markerPosition,
        streetNumber: this.state.streetNumber,
        area: this.state.area,
        address: this.state.address,
        country: this.state.country,
        city: this.state.city,
        province: this.state.state,
        ZipCode: this.state.ZipCode,
      });
    }
  };
  onAutocompleteKeyEvent = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      return false;
    }
  };
  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <div>
          {this.props.autocomplete && (
              <div className="form-group row">
              {/* <label className="col-xl-3 col-lg-3 col-form-label">
                Enter Location
              </label> */}
              <div className="col-lg-9 col-xl-6 location-design">
               
              <Autocomplete
              // className="form-control"
              style={{
                height: "44px",
                border:"1px solid #c4c4c4" , 
                paddingLeft: "16px",
                marginTop: "2px",
                width:"100%" , 
                background:"#F3F6F9" ,
                position: "relative",
                bottom: "461px",
              }}
              onKeyDown={this.onAutocompleteKeyEvent}
              onPlaceSelected={this.onPlaceSelected}
              types={[ "geocode" ]}
            />
              </div>
            </div>
           
          )}

          <GoogleMap
            google={this.props.google}
            defaultZoom={this.props.zoom}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng,
            }}
          >
            {/* For Auto complete Search Box */}

            {/*Marker*/}
            <Marker
              google={this.props.google}
              name={"Dolores park"}
              draggable={true}
              onDragEnd={this.onMarkerDragEnd}
              position={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng,
              }}
            />
            <Marker />
            {/* InfoWindow on top of marker */}
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{
                lat: this.state.markerPosition.lat + 0.0018,
                lng: this.state.markerPosition.lng,
              }}
            >
              <div>
                <span style={{ padding: 0, margin: 0 }}>
                  {this.state.address}
                </span>
              </div>
            </InfoWindow>
          </GoogleMap>
        </div>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          {/* <div>
          <div className="form-group">
            <label htmlFor="">City</label>
            <input type="text" name="city" className="form-control" onChange={this.onChange} value={this.state.city} />
          </div>
          <div className="form-group">
            <label htmlFor="">Area</label>
            <input type="text" name="area" className="form-control" onChange={this.onChange} value={this.state.area} />
          </div>
          <div className="form-group">
            <label htmlFor="">State</label>
            <input type="text" name="state" className="form-control" onChange={this.onChange} value={this.state.state} />
          </div>
          <div className="form-group">
            <label htmlFor="">Address</label>
            <input type="text" name="address" className="form-control" onChange={this.onChange} value={this.state.address} />
          </div>
        </div> */}
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZZeGlIGUIPs4o8ahJE_yq6pJv3GhbKQ8&libraries=places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default Map;

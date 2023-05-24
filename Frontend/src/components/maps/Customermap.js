import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Circle, Marker } from 'google-maps-react';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fenceCenter: { lat: props.latitude, lng: props.longitude },
      customerLocation: { lat: null,lng: null}
    };
  }

  handleMapClick = (mapProps, map, e) => {
  const newCenter = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      this.setState({ customerLocation: newCenter });
      this.props.handleLocationChange(newCenter.lat,newCenter.lng);
  }

  render() {
    const mapStyles = {
      width: '80%',
      height: '90%',
      borderRadius: '10px'
    };

    return (
      <Map
        google={this.props.google}
        zoom={16}
        style={mapStyles}
        initialCenter={this.state.fenceCenter}
        onClick={(mapProps, map, e) => this.handleMapClick(mapProps, map, e)}
      >
        <Marker
            position={this.state.fenceCenter}
            title='Food Truck'
            icon={{
                url: 'https://theroamingkitchen.s3.ap-south-1.amazonaws.com/logo/ftruck.png',
                anchor: new window.google.maps.Point(250,205),
              }}
        />
          <Marker
            position={this.state.customerLocation}
            title='Customer Location'
          />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer);
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Circle, Marker } from 'google-maps-react';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fenceCenter: { lat: props.latitude, lng: props.longitude },
    };
  }

  handleMapClick = (mapProps,map,e) => {
    const newCenter = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    this.props.handleLocationChange(newCenter.lat,newCenter.lng);
    this.setState({ fenceCenter: newCenter });
  };

  render() {
    const mapStyles = {
      width: '80%',
      height: '80%',
      borderRadius: '10px'
    };

    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={this.state.fenceCenter}
        onClick={(mapProps, map, e) => this.handleMapClick(mapProps, map, e)}
      >
         <Circle
          center= {this.state.fenceCenter}
          radius={5000}
          strokeColor='#5CAC0E'
          strokeOpacity={0.9}
          strokeWeight={2}
          fillColor='#94C973'
          fillOpacity={0.35}
        >
        </Circle>
        <Marker
            position={this.state.fenceCenter}
            icon={{
              url: 'https://theroamingkitchen.s3.ap-south-1.amazonaws.com/logo/ftruck.png',
              anchor: new window.google.maps.Point(250,205),
            }}
          />

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer);
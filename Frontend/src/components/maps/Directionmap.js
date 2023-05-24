import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MyContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      storeLocation: { lat: props.storeLatitude, lng: props.storeLongitude },
      customerLocation: { lat: props.customerLatitude, lng: props.customerLongitude },
      distance: null,
      duration: null
    };
    this.map = null;
  }

  componentDidMount() {
    const { google } = this.props;
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#5CAC0E", 
        strokeWeight: 7
      }
    });

    const origin = new google.maps.LatLng(this.state.storeLocation);
    const destination = new google.maps.LatLng(this.state.customerLocation);

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result)
          const distance = result.routes[0].legs[0].distance.text;
          const duration = result.routes[0].legs[0].duration.text;
          this.setState({
            directions: result.routes,
            distance: distance,
          duration: duration
          });
          directionsRenderer.setMap(this.map);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  render() {
    const mapStyles = {
      width: '100%',
      height: '90%',
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden'
    };

    return (
      <div style={{ overflow: 'hidden',position: 'relative', width: '50rem', height: '25rem'}} >
      <div style={{ textAlign: 'start', margin: '10px' }}>
        {this.state.distance && this.state.duration ? (
          <div>
            <strong className='text-darkgreen'>Distance:</strong> {this.state.distance} | <strong className='text-darkgreen'>Duration:</strong> {this.state.duration}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <Map
        google={this.props.google}
        zoom={20}
        style={mapStyles}
        initialCenter={this.state.storeLocation}
        onReady={(_, map) => {
          this.map = map;
        }}
      >
      <Marker
            position={this.state.storeLocation}
            title='Food truck'
            icon={{
              url: 'https://theroamingkitchen.s3.ap-south-1.amazonaws.com/logo/ftruck.png',
              anchor: new window.google.maps.Point(250,205),
            }}
          />
                <Marker
            position={this.state.customerLocation}
            title='Customer location'
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // sets the marker color to green
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(25, 50)
            }}
          />
      </Map>
      </div>

      
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MyContainer);

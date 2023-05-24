import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants/backendurl";
import { updateLocation } from "../../redux/slices/managerSlice";
import MapContainer from "../maps/Customermap";
import { boolean } from "square/dist/types/schema";
import { useDispatch } from "react-redux";
import { updateCustomerLocation } from "../../redux/slices/customerSlice";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";

interface Locationdata {
  id: number;
  latitude: number;
  longitude: number;
}

const Customer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locdata, setLocdata] = useState<Locationdata>();

  const [customerLocation, setCustomerLocation] = useState<Locationdata>();

  const [deliverystatus, setDeliveryStatus] = useState(false);
  const [deliveryfailure, setDeliveryFailure] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}locations`);
        setLocdata(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function isWithin5km(
    storeLat: number,
    storeLng: number,
    userLat: number,
    userLng: number
  ): boolean {
    const R = 6371; // radius of the Earth in km
    const dLat = toRadians(userLat - storeLat);
    const dLng = toRadians(userLng - storeLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(storeLat)) *
        Math.cos(toRadians(userLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= 5; // check if distance is less than or equal to 5km
  }

  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  const checkDistance = () => {
    const drange: boolean = isWithin5km(
      locdata?.latitude ?? 0,
      locdata?.longitude ?? 0,
      customerLocation?.latitude ?? 0,
      customerLocation?.longitude ?? 0
    );
    if (drange) {
      setDeliveryStatus(true);
      setDeliveryFailure(false);
    } else {
      setDeliveryStatus(false);
      setDeliveryFailure(true);
    }
  };

  const handleLocationChange = async (latitude: any, longitude: any) => {
    setCustomerLocation({ id: 0, latitude: latitude, longitude: longitude });
  };

  const proceedToOrder = async () => {
    const drange: boolean = isWithin5km(
      locdata?.latitude ?? 0,
      locdata?.longitude ?? 0,
      customerLocation?.latitude ?? 0,
      customerLocation?.longitude ?? 0
    );
    if (drange) {
      setDeliveryStatus(true);
      setDeliveryFailure(false);
      dispatch(
        updateCustomerLocation({
          storelatitude: locdata?.latitude,
          storelongitude: locdata?.longitude,
          customerlatitude: customerLocation?.latitude,
          customerlongitude: customerLocation?.longitude,
        })
      );
      navigate("/customer/home");
    } else {
      setDeliveryStatus(false);
      setDeliveryFailure(true);
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {!isLoading && (
        <>
          <div className="flex w-full h-full justify-between pt-5 pl-10 pr-10">
            <Link to="/">
              <div className="flex h-full pr-5">
                <HomeIcon fontSize="large" color="secondary"></HomeIcon>
              </div>
            </Link>
            <div className="flex w-full h-full text-2xl font-poppins font-semibold text-darkgreen">
              Select Your Location
            </div>
            <button
              className="w-48 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
              onClick={checkDistance}
            >
              Check Delivery
            </button>
          </div>
          <div className="flex w-full h-full relative pt-10 pl-20 pr-10 maps">
            <MapContainer
              latitude={locdata?.latitude}
              longitude={locdata?.longitude}
              handleLocationChange={handleLocationChange}
            />
          </div>
          <div className="flex w-full h-full pt-5 pl-10 pr-10">
            {deliverystatus && (
              <div className="flex justify-center w-full h-full text-2xl font-poppins font-semibold text-darkgreen">
                We deliver to your location
              </div>
            )}
            {deliveryfailure && (
              <div className="flex justify-center w-full h-full text-2xl font-poppins font-semibold text-red-500">
                Sorry, we currently do not deliver to your location
              </div>
            )}
            {deliverystatus && (
              <button
                className="w-48 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                onClick={proceedToOrder}
              >
                PLACE ORDER
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Customer;

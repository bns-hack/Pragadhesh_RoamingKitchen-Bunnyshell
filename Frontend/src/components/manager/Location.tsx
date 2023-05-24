import React, { useState, useEffect } from "react";
import MapContainer from "../maps/Googlemap";
import "./Location.css";
import { Box, CircularProgress, Modal } from "@mui/material";
import { BACKEND_URL } from "../../constants/backendurl";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateLocation } from "../../redux/slices/managerSlice";

interface Locationdata {
  id: number;
  latitude: number;
  longitude: number;
}

const updatemodalstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "background.paper",
  border: "2px solid #5CAC0E",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const Location = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [locdata, setLocdata] = useState<Locationdata>();

  const [update, setIsUpdate] = useState(false);
  const [upResponse, setUpresponse] = useState("");

  const handleupdateItemOpen = () => {
    setIsUpdate(true);
  };
  const handleupdateItemClose = () => {
    setIsUpdate(false);
    setUpresponse("");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}locations`);
        setLocdata(response.data);
        dispatch(
          updateLocation({
            latitude: locdata?.latitude,
            longitude: locdata?.longitude,
          })
        );
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLocationChange = async (latitude: any, longitude: any) => {
    setLocdata({ id: 0, latitude: latitude, longitude: longitude });
    dispatch(
      updateLocation({
        latitude: latitude,
        longitude: longitude,
      })
    );
  };

  const updateStoreLocation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${BACKEND_URL}locations`, {
        latitude: locdata?.latitude,
        longitude: locdata?.longitude,
      });
      if (response.status === 200) {
        setLocdata(response.data);
        dispatch(
          updateLocation({
            latitude: locdata?.latitude,
            longitude: locdata?.longitude,
          })
        );
        setIsUpdate(true);
        setUpresponse("Location updated successfully");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setIsUpdate(true);
      setUpresponse("Error in updating the location");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {!isLoading && (
        <Modal open={update} onClose={handleupdateItemClose}>
          <Box sx={updatemodalstyle}>
            <div className="flex w-full h-full items-center justify-center text-xl font-poppins">
              {upResponse}
            </div>
          </Box>
        </Modal>
      )}
      {isLoading ? (
        <div className="flex w-full h-full justify-center items-center pt-60">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      ) : (
        <>
          <div className="flex p-10 w-full justify-between">
            <div className="flex w-full font-poppins font-semibold text-xl text-darkgreen">
              SET GEOLOCATION
            </div>
            <button
              className="w-48 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
              onClick={updateStoreLocation}
            >
              UPDATE LOCATION
            </button>
          </div>
          <div className="flex w-full pl-20 pr-10 maps">
            <MapContainer
              latitude={locdata?.latitude}
              longitude={locdata?.longitude}
              handleLocationChange={handleLocationChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Location;

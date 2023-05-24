import {
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import MapContainer from "../maps/Directionmap";
import { Order } from "../../interface/activeorders";
import { BACKEND_URL } from "../../constants/backendurl";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [orderstatus, setOrderStatus] = useState(false);

  const [category, setCategory] = useState("details");
  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    setCategory(newCategory);
  };

  const [orderdetails, setOrderDetails] = useState<Order>(
    useSelector((state: any) => state.manager.order)
  );

  const [catalogIds, setCatalogIds] = useState<String[]>([]);

  const [imageUrls, setImageUrls] = useState<String[]>([]);

  const updateDelivery = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}updatedelivery`, {
        orderid: orderdetails.id,
      });
      if (response.status === 200) {
        setResponse(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderdetails) {
      setIsLoading(true);
      setOrderStatus(true);
      setCatalogIds(orderdetails.line_items.map((item) => item.name));
    } else {
      setOrderStatus(false);
    }
  }, [orderdetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (catalogIds.length > 0) {
          console.log(catalogIds);
          const response = await axios.post(
            `${BACKEND_URL}imagedetails`,
            catalogIds
          );
          setImageUrls(response.data);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [catalogIds]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex justify-between w-full h-20 bg-zinc-200">
        <div className="flex w-full items-center">
          <div className="flex self-center imagelogo"></div>
          <div className="flex pl-2 font-semibold font-poppins text-darkgreen self-center pt-5 text-lg">
            THE ROAMING KITCHEN
          </div>
        </div>
        {orderstatus && (
          <div className="flex pr-5 pt-3">
            <Link to="/manager">
              <button className="w-36 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded-3xl">
                Back
              </button>
            </Link>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      )}
      {!isLoading && response && (
        <div className="flex flex-col w-full h-full justify-center items-center pt-48">
          <div className="flex pb-3">
            <VerifiedOutlinedIcon
              style={{ fontSize: "75px", width: "75px", height: "75px" }}
              color="secondary"
            ></VerifiedOutlinedIcon>
          </div>
          <div className="flex text-3xl font-poppins font-semibold text-darkgreen">
            Order Delivered successfully
          </div>
        </div>
      )}
      {!isLoading && !response && orderstatus && (
        <div className="flex flex-col w-full h-full pt-3">
          <div className="flex w-full justify-center">
            <ToggleButtonGroup
              color="primary"
              value={category}
              exclusive
              onChange={handleCategoryChange}
              aria-label="Platform"
            >
              <ToggleButton
                value="details"
                style={
                  category === "details"
                    ? { backgroundColor: "#5CAC0E", color: "white" }
                    : {}
                }
              >
                DETAILS
              </ToggleButton>
              <ToggleButton
                value="address"
                style={
                  category === "address"
                    ? { backgroundColor: "#5CAC0E", color: "white" }
                    : {}
                }
              >
                ADDRESS
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          {category === "address" && (
            <div className="flex pl-5 pr-5 pt-5 w-full h-full overflow-hidden">
              <MapContainer
                storeLatitude={parseFloat(orderdetails.metadata.storelatitude)}
                storeLongitude={parseFloat(
                  orderdetails.metadata.storelongitude
                )}
                customerLatitude={parseFloat(
                  orderdetails.metadata.customerlatitude
                )}
                customerLongitude={parseFloat(
                  orderdetails.metadata.customerlongitude
                )}
              />
              <div className="flex flex-col p-10 w-full h-full justify-start overflow-hidden">
                <div className="flex text-2xl font-poppins text-darkgreen font-semibold">
                  {
                    orderdetails.fulfillments[0].delivery_details.recipient
                      .display_name
                  }
                </div>
                <hr className="w-60 mt-5 border border-gray-300" />
                <div className="flex pt-5 text-xl font-poppin text-limegreen font-bold">
                  Contact
                </div>
                <div className="grid grid-rows-2 gap-2 pt-2">
                  <div className="flex text-sm text-emerald-700 font-semibold w-52">
                    {
                      orderdetails.fulfillments[0].delivery_details.recipient
                        .phone_number
                    }
                  </div>

                  <div className="flex text-sm text-emerald-700 font-semibold w-52 ">
                    {
                      orderdetails.fulfillments[0].delivery_details.recipient
                        .email_address
                    }
                  </div>
                </div>
                <hr className="w-60 mt-5 border border-gray-300" />
                <div className="flex pt-5 text-xl font-poppins text-limegreen font-bold">
                  Address
                </div>
                <div className="flex pt-3 text-sm text-emerald-700 font-semibold w-52">
                  {
                    orderdetails.fulfillments[0].delivery_details.recipient
                      .address.address_line_1
                  }
                </div>
                <div className="flex pt-7">
                  <button
                    className="w-36 h-10 bg-darkgreen text-white font-poppins font-bold text-xs rounded"
                    onClick={updateDelivery}
                  >
                    Complete Delivery
                  </button>
                </div>
              </div>
            </div>
          )}
          {category === "details" && (
            <div className="flex flex-col w-full h-full">
              <div className="flex w-full justify-center">
                <div className="flex w-96 justify-start pb-5 text-xl font-poppins font-semibold text-darkgreen">
                  Items
                </div>
              </div>
              <div className="flex w-full">
                <div className="grid grid-flow-row w-full justify-items-center gap-5">
                  {orderdetails.line_items.map((lineitem, index) => (
                    <div
                      key={lineitem.uid}
                      className="flex h-24 w-full justify-center"
                    >
                      <div className="grid grid-cols-10 w-96 h-full rounded">
                        <div className="flex items-center justify-center h-full col-span-3">
                          <div
                            className="flex h-full w-3/5 rounded menuitem"
                            style={{
                              backgroundImage: `url(${imageUrls[index]})`,
                            }}
                          ></div>
                        </div>
                        <div className="flex col-span-7 items-center w-full h-full">
                          <div className="grid grid-rows-5 w-full h-full">
                            <div className="flex text-sm text-gray-500 font-poppins font-semibold">
                              {lineitem.name}
                            </div>
                            <div className="flex text-xs text-zinc-400 font-poppins font-semibold">
                              {lineitem.variation_name}
                            </div>
                            <div className="flex w-full">
                              <div className="flex text-emerald-700 text-xs font-semibold font-poppins">
                                Quantity :
                              </div>
                              <div className="flex pl-1 text-emerald-700 text-xs font-semibold font-poppins">
                                {lineitem.quantity}
                              </div>
                            </div>
                            <div className="flex text-sm text-darkgreen font-poppins font-semibold">
                              ${lineitem.total_money.amount / 100}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-full pt-5 pb-5 items-center">
                <hr className="w-96 border border-gray-300 mb-5" />
                <div className="flex w-96 justify-between">
                  <div className="flex  text-xl font-poppins font-semibold text-darkgreen">
                    Total
                  </div>
                  <div className="flex  text-xl font-poppins font-semibold text-gray-500">
                    {"$" + orderdetails.total_money.amount / 100}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

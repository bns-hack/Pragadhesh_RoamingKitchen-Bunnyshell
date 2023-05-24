import { Card, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants/backendurl";
import { Order } from "../../interface/activeorders";
import { useDispatch } from "react-redux";
import { updateOrder } from "../../redux/slices/managerSlice";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}orders`);
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDetails = (order: any) => {
    dispatch(
      updateOrder({
        order: order,
      })
    );
    const path = "/manager/orders/" + order.id;
    navigate(path);
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {isLoading && (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col w-full h-full">
          <div className="flex p-10 text-2xl font-semibold font-poppins text-darkgreen">
            Active Orders
          </div>
          <div className="grid grid-flow-row justify-items-center gap-3 w-full">
            {orders.length === 0 && (
              <div className="flex pt-20 font-poppins font-semibold text-darkgreen text-xl">
                No Active Orders found
              </div>
            )}
            {orders.map((order) => (
              <div className="flex w-3/6 h-28 rounded">
                <Card className="grid grid-cols-3  w-full h-full">
                  <div className="flex flex-col justify-center items-center w-full h-full">
                    <div
                      className="flex text-base font-semibold font-poppins text-darkgreen"
                      style={{
                        maxWidth: "80%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {
                        order.fulfillments[0].delivery_details.recipient
                          .display_name
                      }
                    </div>

                    <div className="flex text-sm font-semibold font-poppins text-slate-400">
                      {
                        order.fulfillments[0].delivery_details.recipient
                          .phone_number
                      }
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className="flex text-base font-semibold font-poppins text-darkgreen">
                      {"$" + order.total_money.amount / 100}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center w-full h-full">
                    <button
                      className="w-28 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                      onClick={() => openDetails(order)}
                    >
                      View Details
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import Manager from "./components/manager/Manager";
import Customer from "./components/customer/Customer";
import Recipedetails from "./components/manager/Recipedetails";
import OrderMenu from "./components/customer/OrderMenu";
import Details from "./components/customer/Details";
import OrderDetails from "./components/manager/OrderDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="/manager/recipes/:catalogid" element={<Recipedetails />} />
      <Route path="/manager/orders/:orderid" element={<OrderDetails />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/customer/home" element={<OrderMenu />} />
      <Route path="/customer/details" element={<Details />} />
    </Routes>
  );
};

export default App;

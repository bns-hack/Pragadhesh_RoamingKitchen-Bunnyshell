import React, { useEffect, useState } from "react";
import "./Recipedetails.css";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Card,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { RecipeDetails } from "../../interface/redipedetails";
import axios from "axios";
import { BACKEND_URL } from "../../constants/backendurl";

const Recipedetails = () => {
  const location = useLocation();
  const cid = location.state ? location.state.catalogid : null;
  const [catalogid, setCatalogid] = useState(cid);

  const key = location.state.key;

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(true);
  const [responsemsg, setResponsemsg] = useState("");

  const [recipedetails, setRecipeDetails] = useState<RecipeDetails>();

  const [dishName, setDishName] = useState("");
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    setResponse(false);
    setIsLoading(true);
    if (cid === null) {
      setResponse(true);
      setResponsemsg("Error in fetching recipe details");
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}menu/recipes/${catalogid}`
          );
          setRecipeDetails(response.data);
          setResponse(false);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
          setResponsemsg("Error in fetching the recipe information");
          setResponse(true);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (recipedetails) {
      setAvailability(recipedetails.availability);
      setDishName(recipedetails.foodDish.dishName);
    }
  }, [recipedetails]);

  const handlerecipeLockChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    if (newCategory === "on") {
      setAvailability(true);
    } else {
      setAvailability(false);
    }
  };

  const updateRecipeDetails = async () => {
    setResponse(false);
    setIsLoading(true);
    if (recipedetails) {
      const hasRecipeLock = recipedetails.menuitems.some(
        (item) => item.recipeLock === true
      );
      if (hasRecipeLock) {
        setResponsemsg(
          "One of the Ingredient is locked.Unable to update the recipe"
        );
        setResponse(true);
        setIsLoading(false);
      } else if (availability === recipedetails.availability) {
        setResponsemsg("Item updated successfully");
        setResponse(true);
        setIsLoading(false);
      } else {
        try {
          const response = await axios.post(`${BACKEND_URL}menu/recipes`, {
            catalogid: recipedetails.foodDish.catalogid,
            availability: availability,
          });
          if (response.status === 200) {
            setResponsemsg("Item updated successfully");
            setResponse(true);
            setIsLoading(false);
          }
        } catch (err) {
          setResponsemsg("Error in updating the item");
          setResponse(true);
          setIsLoading(false);
          console.log(err);
        }
      }
    } else {
      setResponsemsg("Error in updating the item");
      setResponse(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll overflow-x-hidden">
      <div className="flex justify-between w-full h-20 bg-zinc-200">
        <div className="flex w-full items-center">
          <div className="flex self-center imagelogo"></div>
          <div className="flex pl-2 font-semibold font-poppins text-darkgreen self-center pt-5 text-lg">
            THE ROAMING KITCHEN
          </div>
        </div>
        <div className="flex pr-5 pt-3">
          <Link to="/manager">
            <button className="w-36 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded-3xl">
              Back
            </button>
          </Link>
        </div>
      </div>
      {!isLoading && !response && (
        <div className="grid grid-cols-2 w-full h-full">
          <div className="flex flex-col w-full h-full justify-items-center pt-16">
            <div
              className="flex w-full h-full recipelogo rounded self-center"
              style={{
                backgroundImage: `url(${recipedetails?.foodDish.imageUrl})`,
              }}
            ></div>
            <div className="flex w-full pt-2 text-xl font-semibold justify-center text-darkgreen">
              {recipedetails?.foodDish.dishName}
            </div>
          </div>
          <div className="grid grid-flow-row items-center pt-10 w-full h-full">
            <div className="flex flex-col w-full h-full pb-5 ">
              <div className="flex pb-3 text-2xl font-poppins font-semibold text-limegreen">
                Order Availability
              </div>
              <ToggleButtonGroup
                color="primary"
                exclusive
                aria-label="Platform"
                onChange={handlerecipeLockChange}
              >
                <ToggleButton
                  value="on"
                  style={
                    availability
                      ? {
                          backgroundColor: "#5CAC0E",
                          color: "white",
                        }
                      : {}
                  }
                >
                  ON
                </ToggleButton>
                <ToggleButton
                  value="off"
                  style={
                    !availability
                      ? {
                          backgroundColor: "#5CAC0E",
                          color: "white",
                        }
                      : {}
                  }
                >
                  OFF
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="flex w-full h-full pb-5 pr-5">
              <div className="grid grid-flow-row w-full h-full grid-cols-4 gap-y-4 gap-x-5">
                {recipedetails?.menuitems.map((ingredient) => (
                  <Card
                    key={ingredient.id}
                    className={`grid grid-rows-6 w-full h-full border-2 border-darkgreen self-center justify-self-center ${
                      ingredient.recipeLock
                        ? "border-red-500"
                        : "border-darkgreen"
                    }`}
                  >
                    <div
                      className="flex w-40 h-40 row-span-5 menuitem"
                      style={{
                        backgroundImage: `url(${ingredient.imageUrl})`,
                      }}
                    ></div>
                    <div className="flex text-sm row-span-1 w-full h-full pl-2 font-poppins font-semibold items-center">
                      {ingredient.itemName}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex w-full h-full pb-5">
              <button
                className="w-32 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                onClick={updateRecipeDetails}
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && !response && (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      )}
      {!isLoading && response && (
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex text-2xl font-poppins font-semibold">
            {responsemsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipedetails;

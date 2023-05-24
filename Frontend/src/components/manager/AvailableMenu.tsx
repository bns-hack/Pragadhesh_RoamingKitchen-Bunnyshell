import React, { useEffect, useState } from "react";
import "./Menu.css";
import { Card, CircularProgress, InputBase } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../../constants/backendurl";
import { Recipe } from "../../interface/recipe";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { Item } from "../../interface/orderitem";

const AvailableMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [recipesearchString, setRecipeSearchString] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}menu/availablerecipes`);
        setItems(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function openUpdateRecipe(catalogid: any) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const path = "/manager/recipes/" + catalogid;
    navigate(path, {
      state: {
        catalogid: catalogid,
        key: randomNumber,
      },
    });
  }

  return (
    <>
      {isLoading && (
        <div className="flex w-full h-full pt-64 justify-center items-center">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col w-full h-full">
          <div className="flex pt-10 pr-10 pl-10 justify-between">
            <div className="flex pl-3 w-60 h-10 rounded border-2 border-limegreen items-center">
              <SearchIcon color="secondary"></SearchIcon>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Menu"
                value={recipesearchString}
                onChange={(e) => setRecipeSearchString(e.target.value)}
              />
            </div>
          </div>
          <div className="grid p-10 grid-flow-row grid-cols-4 gap-x-5 gap-y-8">
            {items
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(recipesearchString.toLowerCase())
              )
              .map((item) => (
                <Card
                  key={item.id}
                  className="grid grid-rows-6 w-48 h-60 border-2 border-darkgreen"
                  onClick={() => openUpdateRecipe(item.id)}
                >
                  <div
                    className="flex row-span-5 w-full h-full menuitem"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                    }}
                  ></div>
                  <div className="flex row-span-1 w-full h-full justify-center font-poppins font-semibold items-center">
                    {item.name}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableMenu;

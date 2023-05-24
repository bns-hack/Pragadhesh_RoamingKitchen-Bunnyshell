import "./Inventory.css";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/backendurl";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { FoodDish, MenuItems } from "../../interface/menuitem";
import { useNavigate } from "react-router-dom";

const additemmodalstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #5CAC0E",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const updateitemmodalstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  height: 550,
  bgcolor: "background.paper",
  border: "2px solid #5CAC0E",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const Inventory = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [searchString, setSearchString] = useState("");

  const [addItemModal, setAddItemModal] = useState(false);
  const [addItemIsLoading, setAddItemIsLoading] = useState(false);
  const [addItemResponse, setAddItemResponse] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");

  const handleaddItemOpen = () => {
    setAddItemUnit("PIECE");
    setItemAmount("30");
    setAddItemModal(true);
  };

  const handleaddItemClose = () => {
    setItemName("");
    setAddItemIsLoading(false);
    setAddItemResponse(false);
    setAddItemModal(false);
  };

  const [updateItemModal, setUpdateItemModal] = useState(false);
  const [updateItemIsLoading, setUpdateItemIsLoading] = useState(false);
  const [updateItemResponse, setUpdateItemResponse] = useState(false);
  const [upResponse, setUpResponse] = useState("");
  const [upid, setupid] = useState(0);
  const [upitemName, setupItemName] = useState("");
  const [upitemunit, setupitemunit] = useState("");
  const [upitemAmount, setupItemAmount] = useState("");
  const [upimageurl, setupimageurl] = useState("");
  const [upRecipeLock, setUpRecipeLock] = useState(false);

  const [upItemFooddish, setUpItemFooddish] = useState<FoodDish[]>([]);

  const handleupdateItemOpen = (
    id: any,
    name: any,
    unit: any,
    amount: any,
    imageurl: any,
    fooddish: any,
    recipeLock: any
  ) => {
    setCategory("item");
    setupid(id);
    setupItemName(name);
    setupitemunit(unit);
    setupItemAmount(amount);
    setupimageurl(imageurl);
    setUpRecipeLock(recipeLock);
    setUpItemFooddish(fooddish);
    setUpdateItemModal(true);
  };
  const handleupdateItemClose = () => {
    setUpdateItemIsLoading(false);
    setUpdateItemResponse(false);
    setUpdateItemModal(false);
    setUpResponse("");
  };

  const [category, setCategory] = React.useState("item");
  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    setCategory(newCategory);
  };

  const handlerecipeLockChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    if (newCategory === "on") {
      setUpRecipeLock(true);
    } else {
      setUpRecipeLock(false);
    }
  };

  const [addItemUnit, setAddItemUnit] = React.useState("PIECE");
  const handleAddItemUnitChange = (event: SelectChangeEvent) => {
    setAddItemUnit(event.target.value as string);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}menuitem`);
        setMenuItems(response.data);
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

  const addItemToInventory = async () => {
    setAddItemIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}menuitem`, {
        itemName: itemName,
        unit: addItemUnit,
        amount: itemAmount.toString(),
      });
      if (response.status === 200) {
        setMenuItems(response.data);
        setAddItemIsLoading(false);
        setAddItemResponse(true);
      }
    } catch (error: any) {
      console.log(error);
      setAddItemIsLoading(false);
    }
  };

  const updateItemToInventory = async () => {
    setUpdateItemIsLoading(true);
    try {
      const response = await axios.put(`${BACKEND_URL}menuitem`, {
        id: upid,
        itemName: upitemName,
        unit: upitemunit,
        amount: upitemAmount.toString(),
        recipeLock: upRecipeLock,
      });
      if (response.status === 200) {
        setMenuItems(response.data);
        setUpResponse("Item Updated successfully");
        setUpdateItemIsLoading(false);
        setUpdateItemResponse(true);
      }
    } catch (error: any) {
      console.log(error);
      setUpResponse("Error in updating item. Please try again");
      setUpdateItemIsLoading(false);
      setUpdateItemResponse(true);
    }
  };

  const deleteItemFromInventory = async () => {
    setUpdateItemIsLoading(true);
    try {
      const response = await axios.delete(`${BACKEND_URL}menuitem`, {
        data: {
          id: upid,
          itemName: upitemName,
          unit: upitemunit,
          amount: upitemAmount.toString(),
        },
      });
      if (response.status === 200) {
        setMenuItems(response.data);
        setUpResponse("Item Removed successfully");
        setUpdateItemIsLoading(false);
        setUpdateItemResponse(true);
      }
    } catch (error: any) {
      console.log(error);
      setUpResponse("Error in updating item. Please try again");
      setUpdateItemIsLoading(false);
      setUpdateItemResponse(true);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex w-full h-full pt-64 justify-center items-center">
          <CircularProgress sx={{ color: "#5CAC0E" }} />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col w-full h-full">
          <Modal open={updateItemModal} onClose={handleupdateItemClose}>
            <Box sx={updateitemmodalstyle}>
              {!updateItemIsLoading && !updateItemResponse && (
                <div className="flex flex-col w-full h-full">
                  <div className="flex w-full  justify-center">
                    <ToggleButtonGroup
                      color="primary"
                      value={category}
                      exclusive
                      onChange={handleCategoryChange}
                      aria-label="Platform"
                    >
                      <ToggleButton
                        value="item"
                        style={
                          category === "item"
                            ? { backgroundColor: "#5CAC0E", color: "white" }
                            : {}
                        }
                      >
                        ITEM
                      </ToggleButton>
                      <ToggleButton
                        value="recipes"
                        style={
                          category === "recipes"
                            ? { backgroundColor: "#5CAC0E", color: "white" }
                            : {}
                        }
                      >
                        RECIPES
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  {category === "item" && (
                    <div className="flex flex-col w-full h-full">
                      <div className="grid grid-cols-2 w-full h-full pt-5 justify-center">
                        <div
                          className="flex w-full h-full updatemenuitem rounded"
                          style={{
                            backgroundImage: `url(${upimageurl})`,
                          }}
                        ></div>
                        <div className="grid grid-rows-3 w-full pl-5">
                          <div className="flex flex-col w-full h-full">
                            <div className="flex text-xl font-poppins font-semibold">
                              Item Name
                            </div>
                            <div className="flex  pt-3 text-darkgreen text-lg font-poppins">
                              {upitemName}
                            </div>
                          </div>
                          <div className="flex flex-col w-full h-full">
                            <div className="flex text-xl font-poppins font-semibold">
                              Unit
                            </div>
                            <div className="flex  pt-3 text-darkgreen text-lg font-poppins">
                              {upitemunit}
                            </div>
                          </div>
                          <div>
                            <div className="flex text-xl font-poppins font-semibold">
                              Amount
                            </div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              type="number"
                              value={upitemAmount}
                              className="flex pt-3"
                              color="secondary"
                              onChange={(event) =>
                                setupItemAmount(event.target.value)
                              }
                            />
                          </div>
                          <div>
                            <div className="flex text-xl font-poppins font-semibold pb-2">
                              Recipe lock
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
                                  upRecipeLock
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
                                  !upRecipeLock
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
                        </div>
                      </div>
                      <div className="grid pt-5 grid-flow-col gap-2 w-full justify-end">
                        <button
                          className="w-32 h-12 bg-red-600 text-white font-poppins font-bold text-sm rounded"
                          onClick={deleteItemFromInventory}
                        >
                          Delete Item
                        </button>
                        <button
                          className="w-32 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                          onClick={updateItemToInventory}
                        >
                          Update Item
                        </button>
                      </div>
                    </div>
                  )}
                  {category === "recipes" && (
                    <div className="grid pt-5 grid-cols-3 gap-5 grid-flow-row overflow-auto">
                      {upItemFooddish.map((recipe) => (
                        <Card
                          key={recipe.id}
                          className="grid grid-rows-6 w-48 h-60 border-2 border-darkgreen"
                          onClick={() => openUpdateRecipe(recipe.catalogid)}
                        >
                          <div
                            className="flex row-span-5 w-full h-full menuitem"
                            style={{
                              backgroundImage: `url(${recipe.imageUrl})`,
                            }}
                          ></div>
                          <div className="flex row-span-1 w-full h-full justify-center font-poppins font-semibold items-center">
                            {recipe.dishName}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {updateItemIsLoading && (
                <div className="flex flex-col w-full h-full justify-center items-center">
                  <div className="flex pb-5 text-xl font-poppins">
                    Please wait while updating the inventory
                  </div>
                  <CircularProgress sx={{ color: "#5CAC0E" }} />
                </div>
              )}
              {updateItemResponse && (
                <div className="flex flex-col w-full h-full justify-center items-center">
                  <div className="flex pb-5 text-xl font-poppins">
                    {upResponse}
                  </div>
                </div>
              )}
            </Box>
          </Modal>
          <Modal open={addItemModal} onClose={handleaddItemClose}>
            <Box sx={additemmodalstyle}>
              <div className="flex flex-col w-full h-full">
                {addItemIsLoading && !addItemResponse && (
                  <div className="flex w-full h-full">
                    <div className="flex flex-col w-full h-full justify-center items-center">
                      <div className="flex justify-center pl-10 pr-10 pb-5  font-poppins">
                        Please wait while we add the item to inventory and
                        generate an image, this might take a few moments.
                      </div>
                      <CircularProgress sx={{ color: "#5CAC0E" }} />
                    </div>
                  </div>
                )}
                {!addItemIsLoading && addItemResponse && (
                  <div className="flex w-full h-full">
                    <div className="flex w-full h-full text-xl font-semibold font-poppins justify-center items-center">
                      Item Added Successfully
                    </div>
                  </div>
                )}
                {!addItemIsLoading && !addItemResponse && (
                  <>
                    <div className="grid grid-rows-3 grid-flow-col items-center gap-7 w-full pt-5 justify-start">
                      <div className="grid w-full h-full grid-cols-2">
                        <div className="flex font-poppins text-xl font-normal h-7 self-center">
                          Item Name
                        </div>
                        <TextField
                          id="outlined-basic"
                          label="Name"
                          variant="outlined"
                          className="flex pl-5"
                          value={itemName}
                          onChange={(event) => setItemName(event.target.value)}
                          color="secondary"
                        />
                      </div>
                      <div className="grid w-full h-full grid-cols-2">
                        <div className="flex font-poppins text-xl font-normal h-7 self-center">
                          Unit
                        </div>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Unit
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={addItemUnit}
                            label="Unit"
                            onChange={handleAddItemUnitChange}
                            defaultValue="PIECE"
                            color="secondary"
                          >
                            <MenuItem value={"PIECE"}>PIECE</MenuItem>
                            <MenuItem value={"GRAM"}>GRAM</MenuItem>
                            <MenuItem value={"TEASPOON"}>TEASPOON</MenuItem>
                            <MenuItem value={"TABLESPOON"}>TABLESPPON</MenuItem>
                            <MenuItem value={"CUP"}>CUP</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="grid w-full h-full grid-cols-2">
                        <div className="flex font-poppins text-xl font-normal h-7 self-center">
                          Amount
                        </div>
                        <TextField
                          id="outlined-basic"
                          label="Amount"
                          variant="outlined"
                          type="number"
                          value={itemAmount}
                          onChange={(event) =>
                            setItemAmount(event.target.value)
                          }
                          className="flex pl-5"
                          color="secondary"
                        />
                      </div>
                    </div>
                    <div className="flex w-full justify-end pt-7">
                      <button
                        className="w-48 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                        onClick={addItemToInventory}
                      >
                        Add Item to Inventory
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Box>
          </Modal>

          <div className="flex pt-10 pr-10 pl-10 justify-between">
            <div className="flex pl-3 w-60 h-10 rounded border-2 border-limegreen items-center">
              <SearchIcon color="secondary"></SearchIcon>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Inventory"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
            <button
              className="w-36 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded-3xl"
              onClick={handleaddItemOpen}
            >
              Add Item
            </button>
          </div>
          <div className="grid p-10 grid-flow-row grid-cols-4 gap-x-5 gap-y-8">
            {menuItems
              .filter((item) =>
                item.itemName.toLowerCase().includes(searchString.toLowerCase())
              )
              .map((item) => (
                <Card
                  key={item.id}
                  className={`grid grid-rows-6 w-48 h-60 border-2 ${
                    item.recipeLock ? "border-red-500" : "border-darkgreen"
                  }`}
                  onClick={() =>
                    handleupdateItemOpen(
                      item.id,
                      item.itemName,
                      item.unit,
                      item.amount,
                      item.imageUrl,
                      item.foodDishes,
                      item.recipeLock
                    )
                  }
                >
                  <div
                    className="flex row-span-5 w-full h-full menuitem"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                    }}
                  ></div>
                  <div className="flex row-span-1 w-full h-full justify-center font-poppins font-semibold items-center">
                    {item.itemName}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Theme, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { CartItem, Item, ItemVariation } from "../../interface/orderitem";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateCustomerCart } from "../../redux/slices/customerSlice";
import axios from "axios";
import { BACKEND_URL } from "../../constants/backendurl";

const addItemModalstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #5CAC0E",
  boxShadow: 24,
  borderRadius: 2,
  outline: "none",
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, itemType: string | undefined, theme: Theme) {
  return {
    fontWeight:
      itemType === name
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

const OrderMenu = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  const [addItemModal, setAddItemModal] = useState(false);

  const [addItemName, setAddItemName] = useState("");
  const [addItemImageUrl, setAddItemImageUrl] = useState("");
  const [addItemVariations, setAddItemVariations] = useState<ItemVariation[]>(
    []
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartInfo, setCartInfo] = useState(false);

  const [quantity, setQuantity] = useState(0);
  const [addItemResponse, setAddItemResponse] = useState(false);
  const [total, setTotal] = useState<number>(0);

  const handleaddItemClose = () => {
    setitemType("");
    setAddItemName("");
    setAddItemImageUrl("");
    setAddItemVariations([]);
    setQuantity(0);
    setAddItemResponse(false);
    setAddItemModal(false);
  };

  const handleaddItemOpen = (
    name: any,
    image: any,
    variations: ItemVariation[]
  ) => {
    setAddItemName(name);
    setAddItemImageUrl(image);
    setAddItemVariations(variations);
    setQuantity(1);
    setitemType(variations[0].item_variation_data.name);
    setAddItemModal(true);
  };

  const handleOpenCart = () => {
    setCartInfo(true);
  };

  const handleCloseCart = () => {
    setCartInfo(false);
  };

  const AddItemToCart = (itemType: any) => {
    const matchedVariation = addItemVariations.find(
      (variation) => variation.item_variation_data.name === itemType
    );

    if (matchedVariation) {
      const existingCartItem = cartItems.find(
        (item) => item.id === matchedVariation.id
      );

      if (existingCartItem) {
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.id === existingCartItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        const cartItem: CartItem = {
          id: matchedVariation.id,
          name: addItemName,
          imageUrl: addItemImageUrl,
          variation: matchedVariation,
          quantity: quantity,
          amount: getItemPrice(itemType),
        };
        setCartItems((prevCartItems) => [...prevCartItems, cartItem]);
      }

      setAddItemResponse(true);
    } else {
      console.log("No matching variation found for itemType:", itemType);
    }
  };

  const getItemPrice = (itemType: any) => {
    const selectedItem = addItemVariations.find(
      (variation) => variation.item_variation_data.name === itemType
    );
    if (selectedItem) {
      return selectedItem.item_variation_data.price_money.amount / 100;
    }
    return 0;
  };

  const [itemType, setitemType] = React.useState<string>();
  const handleChange = (event: SelectChangeEvent<typeof itemType>) => {
    const {
      target: { value },
    } = event;
    setitemType(value);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleCartItemIncrement = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleCartItemDecrement = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity !== 0)
    );
  };

  const handleCheckout = () => {
    dispatch(updateCustomerCart({ cartitems: cartItems }));
    navigate("/customer/details");
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setCartInfo(false);
    }
    const calculateTotal = () => {
      let sum = 0;
      cartItems.forEach((item) => {
        sum +=
          item.variation.item_variation_data.price_money.amount * item.quantity;
      });
      setTotal(sum / 100);
    };
    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}catalog`);
        setItems(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll overflow-x-hidden">
      <div className="flex justify-between w-full h-20 bg-zinc-200">
        <div className="flex w-full items-center">
          <div className="flex self-center imagelogo"></div>
          <div className="flex pl-2 font-semibold font-poppins text-darkgreen self-center pt-5 text-lg">
            THE ROAMING KITCHEN
          </div>
        </div>
        {!cartInfo && (
          <div className="flex pr-5 pt-3">
            <Link to="/customer">
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
      {!isLoading && !cartInfo && (
        <div>
          <div className="flex w-full justify-end">
            <Modal open={addItemModal} onClose={handleaddItemClose}>
              <Box sx={addItemModalstyle}>
                {!addItemResponse && (
                  <div className="grid grid-cols-2 w-full h-full">
                    <div
                      className="flex w-full h-full menuitem rounded"
                      style={{
                        backgroundImage: `url(${addItemImageUrl})`,
                      }}
                    ></div>
                    <div className="flex flex-col w-full h-full p-3 justify-center">
                      <div className="flex pb-5 w-full font-poppins text-xl text-darkgreen font-semibold">
                        {addItemName}
                      </div>
                      <FormControl sx={{ m: 1, width: 250 }} color="secondary">
                        <InputLabel id="demo-multiple-name-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          value={itemType}
                          onChange={handleChange}
                          input={<OutlinedInput label="Name" />}
                          MenuProps={MenuProps}
                        >
                          {addItemVariations.map((variation) => (
                            <MenuItem
                              key={variation.id}
                              value={variation.item_variation_data.name}
                              style={getStyles(
                                variation.item_variation_data.name,
                                itemType,
                                theme
                              )}
                            >
                              {variation.item_variation_data.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className="flex pt-5 pr-5 justify-between">
                        <div className="flex w-full font-poppins text-xl text-darkgreen font-semibold  pr-5 pl-3">
                          Quantity
                        </div>
                        <div className="w-32 items-center grid grid-cols-3 flex-row rounded-sm">
                          <Card
                            className="flex w-6 h-6 items-center justify-center"
                            onClick={handleDecrement}
                          >
                            <RemoveIcon fontSize="small" color="secondary" />
                          </Card>
                          <span className="flex justify-center items-center text-darkgreen font-semibold">
                            {quantity}
                          </span>
                          <Card
                            onClick={handleIncrement}
                            className="flex w-6 h-6 items-center justify-center"
                          >
                            <AddIcon fontSize="small" color="secondary" />
                          </Card>
                        </div>
                      </div>
                      <div className="flex pt-5 pr-5 justify-between">
                        <div className="flex w-full font-poppins text-xl text-darkgreen font-semibold  pr-5 pl-3">
                          Price
                        </div>
                        <div className="flex text-xl font-semibold text-darkgreen">
                          {"$" + quantity * getItemPrice(itemType)}
                        </div>
                      </div>
                      <div className="flex w-full justify-end pt-7">
                        <button
                          className="w-28 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded"
                          onClick={() => AddItemToCart(itemType)}
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {addItemResponse && (
                  <div className="flex w-full h-full  text-xl items-center justify-center font-poppins font-semibold text-darkgreen">
                    Item Added successfully
                  </div>
                )}
              </Box>
            </Modal>
            {cartItems.length > 0 && (
              <div className="flex pr-10 pt-4" onClick={handleOpenCart}>
                <div className="relative">
                  <div
                    className="absolute bg-darkgreen rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ zIndex: 1, top: "-10px", right: "-12px" }}
                  >
                    <div className="text-white font-semibold text-sm justify-center items-center">
                      {cartItems.length}
                    </div>
                  </div>
                  <LocalMallIcon fontSize="large" color="secondary" />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-y-5 justify-center pl-48 pr-48 pt-5">
            {items.map((recipe) => (
              <div className="flex justify-center" key={recipe.id}>
                <div
                  className="grid grid-rows-6 w-48 h-72 rounded border-2 border-darkgreen"
                  onClick={() =>
                    handleaddItemOpen(
                      recipe.name,
                      recipe.imageUrl,
                      recipe.variations
                    )
                  }
                >
                  <div
                    className="flex row-span-4 w-full h-full menuitem"
                    style={{
                      backgroundImage: `url(${recipe.imageUrl})`,
                    }}
                  ></div>
                  <div className="flex row-span-1 w-full h-full justify-center font-poppins font-semibold items-center text-darkgreen">
                    {recipe.name}
                  </div>
                  <div className="flex row-span-1 w-full h-full justify-center font-poppins font-semibold items-center bg-limegreen text-white">
                    ADD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isLoading && cartInfo && (
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full justify-end">
            <div className="flex pr-10 pt-4">
              <Button
                className="flex flex-row items-center"
                onClick={handleCloseCart}
              >
                <MenuBookIcon fontSize="large" color="secondary" />
                <div className="flex pl-3 font-poppins text-darkgreen">
                  Back to Menu
                </div>
              </Button>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-96 justify-start pb-5 text-xl font-poppins font-semibold text-darkgreen">
              Cart
            </div>
          </div>
          <div className="flex w-full">
            <div className="grid grid-flow-row w-full justify-items-center gap-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex h-24 w-full justify-center">
                  <div className="grid grid-cols-10 w-96 h-full rounded">
                    <div className="flex items-center justify-center h-full col-span-3">
                      <div
                        className="flex h-full w-3/5 rounded menuitem"
                        style={{
                          backgroundImage: `url(${item.imageUrl})`,
                        }}
                      ></div>
                    </div>
                    <div className="flex col-span-7 items-center w-full h-full">
                      <div className="grid grid-rows-5 w-full h-full">
                        <div className="flex text-sm text-gray-500 font-poppins font-semibold">
                          {item.name}
                        </div>
                        <div className="flex text-xs text-zinc-400 font-poppins font-semibold">
                          {item.variation.item_variation_data.name}
                        </div>
                        <div className="flex text-sm text-darkgreen font-poppins font-semibold">
                          $
                          {(item.variation.item_variation_data.price_money
                            .amount *
                            item.quantity) /
                            100}
                        </div>
                        <div className="row-span-2 w-20 items-center grid grid-cols-3 flex-row rounded-sm">
                          <Card
                            className="flex w-6 h-6 items-center justify-center"
                            onClick={() => handleCartItemDecrement(item.id)}
                          >
                            <RemoveIcon fontSize="small" />
                          </Card>
                          <span className="flex justify-center text-gray-500 font-semibold items-center">
                            {item.quantity}
                          </span>
                          <Card
                            onClick={() => handleCartItemIncrement(item.id)}
                            className="flex w-6 h-6 items-center justify-center"
                          >
                            <AddIcon fontSize="small" />
                          </Card>
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
                {"$" + total}
              </div>
            </div>
            <div className="flex w-96 justify-end pt-5">
              <button
                className="w-28 h-10 bg-darkgreen text-white font-poppins font-semibold  text-sm rounded"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderMenu;

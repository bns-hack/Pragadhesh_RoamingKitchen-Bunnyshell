export interface MenuItems {
  id: number;
  itemName: string;
  imageUrl: string;
  amount: number;
  unit: string;
  foodDishes: FoodDish[];
  low: boolean;
  recipeLock: boolean;
}

export interface FoodDish {
  id: number;
  dishName: string;
  catalogid: string;
  imageUrl: string;
}

export interface FoodDish {
  id: number;
  dishName: string;
  catalogid: string;
  imageUrl: string;
}

export interface MenuItem {
  id: number;
  itemName: string;
  imageUrl: string;
  amount: number;
  unit: string;
  foodDishes: FoodDish[];
  recipeLock: boolean;
  low: boolean;
}

export interface RecipeDetails {
  foodDish: FoodDish;
  menuitems: MenuItem[];
  availability: boolean;
}
  
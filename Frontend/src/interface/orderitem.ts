export interface ItemVariation {
    id: string;
    item_variation_data: ItemVariationData;
  }
  
export  interface ItemVariationData {
    item_id: string;
    name: string;
    price_money: {
      amount: number;
      currency: string;
    };
  }
  
export interface Item {
    id: string;
    name: string;
    description: string;
    availability: boolean;
    imageUrl: string;
    variations: ItemVariation[];
  }

export interface CartItem {
    id: string;
    name: string;
    imageUrl: string;
    variation: ItemVariation;
    quantity: number;
    amount: number
}
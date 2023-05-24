export interface Order {
    location_id: string;
    id: string;
    reference_id: string | null;
    source: {
      name: string;
    };
    customer_id: string;
    line_items: LineItem[];
    taxes: any[] | null;
    discounts: any[] | null;
    service_charges: any[] | null;
    fulfillments: Fulfillment[];
    net_amounts: {
      total_money: Money;
      tax_money: Money;
      discount_money: Money;
      tip_money: Money;
      service_charge_money: Money;
    };
    tenders: Tender[];
    metadata: {
      customerlatitude: string;
      customerlongitude: string;
      storelatitude: string;
      storelongitude: string;
    };
    created_at: string;
    updated_at: string;
    state: string;
    version: number;
    total_money: Money;
    total_tax_money: Money;
    total_discount_money: Money;
    total_tip_money: Money;
    total_service_charge_money: Money;
    ticket_name: string | null;
    net_amount_due_money: Money;
  }
  
export interface LineItem {
    quantity: string;
    uid: string;
    name: string;
    note: string | null;
    catalog_object_id: string;
    catalog_version: number;
    variation_name: string;
    item_type: string;
    metadata: any | null;
    modifiers: any[] | null;
    applied_taxes: any[] | null;
    applied_discounts: any[] | null;
    applied_service_charges: any[] | null;
    base_price_money: Money;
    variation_total_price_money: Money;
    gross_sales_money: Money;
    total_tax_money: Money;
    total_discount_money: Money;
    total_money: Money;
    total_service_charge_money: Money;
  }
  
export interface Fulfillment {
    uid: string;
    type: string;
    state: string;
    metadata: any | null;
    delivery_details: DeliveryDetails;
  }
  
export interface DeliveryDetails {
    recipient: Recipient;
    placed_at: string;
    deliver_at: string;
    prep_time_duration: any | null;
    delivery_window_duration: any | null;
    note: any | null;
    completed_at: any | null;
    cancel_reason: any | null;
    courier_pickup_at: any | null;
    courier_pickup_window_duration: any | null;
    is_no_contact_delivery: any | null;
    dropoff_notes: any | null;
    courier_provider_name: any | null;
    courier_support_phone_number: any | null;
    square_delivery_id: any | null;
    external_delivery_id: any | null;
    managed_delivery: boolean;
  }
  
export interface Recipient {
    customer_id: string;
    display_name: string;
    email_address: string;
    phone_number: string;
    address: {
      address_line_1: string;
      address_line_2: string | null;
      address_line_3: string | null;
      locality: string | null;
      sublocality: string | null;
      sublocality_2: string | null;
      sublocality_3: string | null;
      administrative_district_level_1: string | null;
      administrative_district_level_2: string | null;
      administrative_district_level_3: string | null;
      postal_code: string | null;
      first_name: string | null;
      last_name: string | null;
    };
  }
  
export interface Money {
    amount: number;
    currency: string;
  }
  
export interface Tender {
    type: string;
    id: string;
    location_id: string;
    transaction_id: string;
    created_at: string;
    note: string | null;
    amount_money: Money;
    customer_id: string | null;
    card_details: {
      status: string;
      card: {
        card_brand: string;
        last_4: string;
        exp_month: string | null;
        exp_year: string | null;
        cardholder_name: string | null;
        fingerprint: string;
        customer_id: string | null;
        reference_id: string | null;
      };
      entry_method: string;
    };
    additional_recipients: any[] | null;
    payment_id: string;
  }
  
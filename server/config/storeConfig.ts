/**
 * Store Configuration
 * Centralized business details for the General Store.
 * Easily update store name, address, hours, contact, and delivery policies here.
 */

export interface StoreConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
    landmark: string;
    pincode: string;
    fullAddress: string;
  };
  openingHours: {
    weekdays: string;
    weekends: string;
    holidayNote: string;
  };
  delivery: {
    minimumOrder: number;
    standardDeliveryFee: number;
    freeDeliveryThreshold: number;
    estimatedDeliveryTime: string;
    deliveryAreas: string[];
  };
  payment: {
    codAvailable: boolean;
    onlinePaymentEnabled: boolean;
    acceptedMethods: string[];
  };
}

export const storeConfig: StoreConfig = {
  name: "Annil General Store",
  tagline: "Your Trusted Neighborhood Grocery & Daily Essentials Store",
  phone: "+977 9762592813",
  whatsapp: "+9779762592813",
  email: "vermaanil007777@gmail.com",
  address: {
    street: "Kharendrapur",
    area: "Shivaraj-3",
    city: "Kapilvastu",
    landmark: "Kharendrapur, Shivaraj-3",
    pincode: "32800",
    fullAddress: "Kharendrapur, Shivaraj-3, Kapilvastu, Lumbini",
  },
  openingHours: {
    weekdays: "Sunday – Friday: 6:30 AM – 9:00 PM",
    weekends: "Saturday: Closed",
    holidayNote: "Open Sunday through Friday for fresh groceries and daily essentials",
  },
  delivery: {
    minimumOrder: 300,
    standardDeliveryFee: 70,
    freeDeliveryThreshold: 1500,
    estimatedDeliveryTime: "Within 30–60 minutes",
    deliveryAreas: [
      "Kharendrapur",
      "Shivaraj-3",
      "Chandrauta",
      "Kapilvastu",
      "Lumbini",
      "Surahi",
      "Nearby Local Wards",
    ],
  },
  payment: {
    codAvailable: true,
    onlinePaymentEnabled: true,
    acceptedMethods: ["Cash on Delivery", "eSewa", "Khalti", "Fonepay / QR", "Credit/Debit Card"],
  },
};

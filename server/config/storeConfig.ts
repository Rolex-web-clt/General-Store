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
  name: "Cornerstone General Store",
  tagline: "Your Friendly Neighborhood Grocery & Household Essentials",
  phone: "+1 (555) 234-5678",
  whatsapp: "+15552345678",
  email: "support@cornerstonegeneralstore.com",
  address: {
    street: "45 Market Square",
    area: "Downtown District",
    city: "Metro City",
    landmark: "Opposite Community Park",
    pincode: "10001",
    fullAddress: "45 Market Square, Downtown District, Metro City, 10001",
  },
  openingHours: {
    weekdays: "Monday – Saturday: 7:30 AM – 9:30 PM",
    weekends: "Sunday: 8:00 AM – 8:00 PM",
    holidayNote: "Open on most public holidays for emergency groceries",
  },
  delivery: {
    minimumOrder: 15,
    standardDeliveryFee: 3.5,
    freeDeliveryThreshold: 45,
    estimatedDeliveryTime: "Within 45–90 minutes",
    deliveryAreas: [
      "Downtown District",
      "Northside Suburbs",
      "Riverside Colony",
      "Greenfield Gardens",
      "Highland Park",
      "Tech City Corridor",
    ],
  },
  payment: {
    codAvailable: true,
    onlinePaymentEnabled: true,
    acceptedMethods: ["Cash on Delivery", "eSewa", "Khalti", "Credit/Debit Card", "UPI / QR"],
  },
};

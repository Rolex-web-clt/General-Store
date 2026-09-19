import { StoreInfo } from '../types';

export const STORE_CONFIG: StoreInfo = {
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

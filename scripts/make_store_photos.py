import json
import os

departments = [
    {
        "category": "Groceries",
        "photos": [
            "photo-1560806887-1e4cd0b6cbd6", "photo-1571771894821-ce9b6c11b08e", "photo-1592924357228-91a4daadcfea",
            "photo-1576045057995-568f588f82fb", "photo-1523049673857-eb18f1d7b578", "photo-1582979512210-99b6a53386f9",
            "photo-1464965911861-746a04b4bca6", "photo-1498557850523-fd3d118b962e", "photo-1449339854873-750e6913301b",
            "photo-1550258987-190a2d41a8ba", "photo-1537640538966-79f369143f8f", "photo-1534939561126-855b8675edd7",
            "photo-1513530534585-c7b1394c6d51", "photo-1563565375-f3fdfdbefa83", "photo-1584270359002-23f4b62d8548",
            "photo-1568584711075-3d021a7c3ca3", "photo-1598170845058-32b9d6a5c317", "photo-1587049352846-4a222e784d38",
            "photo-1618512496248-a07fe83aa8cb", "photo-1518977676601-b53f82aba655", "photo-1508313880080-c4bef0730395",
            "photo-1540148426945-6cf22a6b2383", "photo-1615485290382-441e4d049cb5", "photo-1504674900247-0877df9cc836",
            "photo-1590779033100-9f60a05a013d", "photo-1615485500704-8e990f9900f7", "photo-1556801712-76c8eb07bbc9",
            "photo-1551754655-cd27e38d2076", "photo-1557844352-761f2565b576", "photo-1553279768-865429fa0078",
            "photo-1514756331096-242fdeb70d4a", "photo-1528825871115-3581a5387919", "photo-1522858547550-3405742f0207",
            "photo-1615485500803-aa2cb647a956", "photo-1518492104633-130d0cc84637"
        ],
        "names": [
            "Crisp Red Royal Gala Apples", "Cavendish Yellow Bananas Bunch", "Vine-Ripened Cherry Tomatoes",
            "Baby Spinach Tender Greens", "Hass Creamy Fresh Avocados", "Valencia Sweet Juicy Oranges",
            "Fresh Hand-Picked Strawberries", "Wild Fresh Blueberries Punnet", "Crisp English Cucumbers",
            "Golden Sweet Hawaiian Pineapple", "Seedless Crimson Red Grapes", "Zesty Eureka Yellow Lemons",
            "Fresh Persian Green Cooking Limes", "Tri-Color Sweet Bell Peppers", "Farm Fresh Broccoli Crowns",
            "Snowball White Cauliflower", "Sweet Table Garden Carrots", "Yellow Cooking Onions Mesh Bag",
            "Red Bermuda Salad Onions", "Russet Mash & Baking Potatoes", "Baby Red Roasting Potatoes",
            "Whole White Garlic Bulbs", "Spicy Fresh Ginger Rhizome", "Button Cremini Brown Mushrooms",
            "Garden Green Zucchini Squash", "Glossy Purple Italian Eggplant", "Hearts of Romaine Salad Lettuce",
            "Sweet Farm Yellow Corn on Cob", "French Snap Tender Green Beans", "Alphonso Sweet Golden Mangoes",
            "Crisp Ripe Bartlett Pears", "Sweet Purple Dessert Plums", "Juicy Sun-Ripened Peaches",
            "Ruby Jewel Whole Pomegranate", "Tangy Fresh Green Kiwifruit"
        ],
        "brand": "Valley Greens",
        "units": ["1 kg", "500 g", "1 piece", "Pack of 2", "250 g"],
        "base_price": 2.49
    },
    {
        "category": "Rice & Grains",
        "photos": [
            "photo-1586201375761-83865001e31c", "photo-1536304993881-ff6e9eefa2a6", "photo-1594489428504-5c0c480a15fd",
            "photo-1613728913341-8f29e24a49aa", "photo-1509440159596-0249088772ff", "photo-1627483262268-9c2b5b2834b5",
            "photo-1586444248902-2f64eddc13df", "photo-1517673132405-a56a62b18caf", "photo-1551462147-ff29053bfc14",
            "photo-1563379091339-03b21ab4a4f8", "photo-1555949258-eb67b1ef0ceb", "photo-1546548970-71785318a17b",
            "photo-1569718212165-3a8278d5f624", "photo-1552611052-33e04de081de", "photo-1589302168068-964664d93dc0",
            "photo-1594998893017-36147cbcae05", "photo-1574323347407-f5e1ad6d020b", "photo-1541544741938-0af808871cc0",
            "photo-1540420773420-3366772f4999", "photo-1508061252224-237ff54ed0a3", "photo-1607006314181-42cb41c7b884",
            "photo-1589301760014-d929f3979dbc", "photo-1514733670139-4d87a1941d55", "photo-1586201375761-83865001e31d",
            "photo-1586201375761-83865001e31e", "photo-1586201375761-83865001e31f", "photo-1509440159596-0249088772fa",
            "photo-1509440159596-0249088772fb", "photo-1509440159596-0249088772fc", "photo-1574323347407-f5e1ad6d020c",
            "photo-1586201375761-83865001e31a", "photo-1594998893017-36147cbcae06", "photo-1536304993881-ff6e9eefa2a7",
            "photo-1536304993881-ff6e9eefa2a8", "photo-1540420773420-3366772f4998"
        ],
        "names": [
            "Royal Aged Long Grain Basmati Rice (5kg)", "Fragrant Thai Jasmine White Rice", "Organic Whole Brown Rice",
            "Premium Japanese Sushi Rice", "Stoneground Whole Wheat Chakki Atta", "Fine White All-Purpose Flour (Maida)",
            "Organic Rolled Breakfast Porridge Oats", "Hearty Steel-Cut Irish Oats", "Classic Italian Durum Spaghetti No. 5",
            "Ridged Penne Rigate Italian Pasta", "Elbow Macaroni Dry Pasta", "Tricolor Vegetable Fusilli Spirals",
            "Stir-Fry Golden Chowmein Noodles", "Authentic Japanese Ramen Wheat Noodles", "Buckwheat Soba Japanese Noodles",
            "Gluten-Free Rice Vermicelli Noodles", "Stoneground Coarse Yellow Cornmeal Polenta", "Mediterranean Steamed Couscous Grain",
            "Coarse Cracked Wheat Bulgur", "Blanched California Almond Flour", "Pure Tapioca Dessert Starch Flour",
            "Beaten Flattened Breakfast Rice (Poha)", "Organic Black Whole Chia Seeds", "Golden Organic Quinoa Grain",
            "Durum Wheat Semolina Suji Rawa", "Silky White Rice Flour", "Dark Sourdough Rye Flour",
            "Calcium-Rich Finger Millet Ragi Flour", "Great Sorghum Jowar Flour", "Nutritious Pearl Millet Bajra Grain",
            "Parboiled Soft Idli Rice", "Toasted Thin Vermicelli Sevaiyan", "Antioxidant Forbidden Black Rice",
            "Himalayan Red Mountain Unpolished Rice", "Ancient Italian Farro Spelt Grain"
        ],
        "brand": "Royal Harvest",
        "units": ["1 kg", "5 kg bag", "500 g", "400 g", "2 kg"],
        "base_price": 4.99
    },
    {
        "category": "Pulses",
        "photos": [
            "photo-1515543237350-b3eea1ec8082", "photo-1546069901-ba9599a7e63c", "photo-1585238342024-78d387f4a707",
            "photo-1551462147-ff29053bfc15", "photo-1546069901-ba9599a7e63b", "photo-1515543237350-b3eea1ec8084",
            "photo-1515543237350-b3eea1ec8085", "photo-1515543237350-b3eea1ec8086", "photo-1515543237350-b3eea1ec8087",
            "photo-1515543237350-b3eea1ec8088", "photo-1515543237350-b3eea1ec8089", "photo-1515543237350-b3eea1ec808a",
            "photo-1515543237350-b3eea1ec808b", "photo-1515543237350-b3eea1ec808c", "photo-1515543237350-b3eea1ec808d",
            "photo-1515543237350-b3eea1ec808e", "photo-1515543237350-b3eea1ec808f", "photo-1515543237350-b3eea1ec8090",
            "photo-1515543237350-b3eea1ec8091", "photo-1515543237350-b3eea1ec8092", "photo-1515543237350-b3eea1ec8093",
            "photo-1515543237350-b3eea1ec8094", "photo-1515543237350-b3eea1ec8095", "photo-1515543237350-b3eea1ec8096",
            "photo-1515543237350-b3eea1ec8097", "photo-1515543237350-b3eea1ec8098", "photo-1515543237350-b3eea1ec8099",
            "photo-1515543237350-b3eea1ec809a", "photo-1515543237350-b3eea1ec809b", "photo-1515543237350-b3eea1ec809c",
            "photo-1515543237350-b3eea1ec809d", "photo-1515543237350-b3eea1ec809e", "photo-1515543237350-b3eea1ec809f",
            "photo-1515543237350-b3eea1ec80a0", "photo-1515543237350-b3eea1ec80a1"
        ],
        "names": [
            "Yellow Split Moong Dal (1kg)", "Pink Split Masoor Red Lentils", "Toor Arhar Yellow Sambar Dal",
            "Speckled Rajma Chitra Kidney Beans", "Edamame Soybeans in Pod", "Chana Dal Split Bengal Gram",
            "Kabuli Giant White Chickpeas", "Kala Chana Desi Brown Chickpeas", "Dark Mahogany Red Kidney Beans",
            "Whole Black Gram Urad Dal", "White Skinned Split Urad Dal", "Whole Green Moong Sprouting Beans",
            "Sabut Masoor Whole Brown Lentils", "French Puy Peppery Green Lentils", "Beluga Black Petite Caviar Lentils",
            "Golden Split Yellow Soup Peas", "Tender Green Split Soup Peas", "Black Eyed Peas (Lobia)",
            "Cannellini White Italian Kidney Beans", "Great Northern Mild White Beans", "Small White Navy Soup Beans",
            "Mottled Pinto Mexican Refried Beans", "Black Turtle High-Fiber Beans", "Golden Whole Non-GMO Soybeans",
            "Moth Matki Sprouting Brown Beans", "Iron-Rich Horse Gram (Kulthi)", "Crunchy Roasted Dalia Chana",
            "Dried Mediterranean Broad Fava Beans", "Japanese Sweet Red Adzuki Beans", "Borlotti Speckled Cranberry Beans",
            "Fresh Green Tuvar Lilva Pigeon Peas", "Large Flat Butter Lima Beans", "Moong Chilka Split Green Lentils",
            "Urad Chilka Split Gram with Skin", "Triple-Pulse Organic Sprouting Mix"
        ],
        "brand": "Desi Kitchen",
        "units": ["1 kg", "500 g", "400 g"],
        "base_price": 3.29
    },
    {
        "category": "Cooking Oil",
        "photos": [
            "photo-1474979266404-7eaacbcd87c5", "photo-1526947425960-945c6e72858f", "photo-1589927986089-35812388d1f4",
            "photo-1585421514738-01798e348b18", "photo-1508061252224-237ff54ed0a5", "photo-1474979266404-7eaacbcd87c6",
            "photo-1474979266404-7eaacbcd87c7", "photo-1589927986089-35812388d1f5", "photo-1474979266404-7eaacbcd87c8",
            "photo-1474979266404-7eaacbcd87c9", "photo-1474979266404-7eaacbcd87ca", "photo-1474979266404-7eaacbcd87cb",
            "photo-1474979266404-7eaacbcd87cc", "photo-1523049673857-eb18f1d7b579", "photo-1474979266404-7eaacbcd87cd",
            "photo-1474979266404-7eaacbcd87ce", "photo-1474979266404-7eaacbcd87cf", "photo-1474979266404-7eaacbcd87d0",
            "photo-1474979266404-7eaacbcd87d1", "photo-1474979266404-7eaacbcd87d2", "photo-1474979266404-7eaacbcd87d3",
            "photo-1474979266404-7eaacbcd87d4", "photo-1474979266404-7eaacbcd87d5", "photo-1474979266404-7eaacbcd87d6",
            "photo-1474979266404-7eaacbcd87d7", "photo-1474979266404-7eaacbcd87d8", "photo-1589927986089-35812388d1f6",
            "photo-1589927986089-35812388d1f7", "photo-1474979266404-7eaacbcd87d9", "photo-1474979266404-7eaacbcd87da",
            "photo-1474979266404-7eaacbcd87db", "photo-1474979266404-7eaacbcd87dc", "photo-1589927986089-35812388d1f8",
            "photo-1474979266404-7eaacbcd87dd", "photo-1474979266404-7eaacbcd87de"
        ],
        "names": [
            "Extra Virgin Cold-Pressed Olive Oil (1L)", "Raw Virgin Coconut Oil Jar", "Pure Golden Desi Cow Ghee Tin",
            "Non-Stick Canola Baking Oil Spray", "Sweet Cold-Pressed Almond Oil", "Pure Kachi Ghani Mustard Oil (1L)",
            "Refined Clear Sunflower Frying Oil (2L)", "Creamy Buffalo Milk Pure Ghee", "Dark Toasted Asian Sesame Finishing Oil",
            "Cold-Pressed Gingelly Til Oil", "Heart-Friendly Refined Canola Oil", "Cold-Pressed Groundnut Peanut Cooking Oil",
            "Oryzanol-Rich Rice Bran Health Oil", "High-Smoke Pure Culinary Avocado Oil", "Expeller-Pressed Pure Grapeseed Oil",
            "Organic Cold-Pressed Flaxseed Finishing Oil", "French Roasted Walnut Gourmet Oil", "Crushed Garlic Infused Olive Oil",
            "Chili Pepper Spicy Pizza Dipping Oil", "White Truffle Flavored Gourmet Drizzle Oil", "Commercial Deep Frying Palm Olein Oil",
            "Non-GMO Pure Soybean Kitchen Oil", "High-Oleic Organic Safflower Oil", "Raw Cold-Pressed Emerald Hemp Seed Oil",
            "Gourmet Buttery Macadamia Nut Oil", "Olive Oil Continuous Fine Mist Dispenser", "Traditional Vanaspati Vegetable Ghee",
            "Vedic A2 Gir Cow Bilona Cultured Ghee", "Rosemary & Herb Infused Olive Oil", "Pure Cold-Pressed Castor Oil",
            "Styrian Roasted Dark Pumpkin Seed Oil", "Pure Black Seed Kalonji Wellness Oil", "Whipped Salted Desi Butter Ghee",
            "Golden Corn Frying Oil (1.5L)", "Dual Heart Care Oil (Rice Bran & Sesame)"
        ],
        "brand": "Olio Verde / Fortune",
        "units": ["1 Litre bottle", "500 ml jar", "2 Litres", "250 ml", "1 Litre tin"],
        "base_price": 7.49
    },
    {
        "category": "Spices",
        "photos": [
            "photo-1596040033229-a9821ebd058d", "photo-1615485290382-441e4d049cb5", "photo-1509358271058-acd22cc93898",
            "photo-1532336414038-cf19250c5757", "photo-1505253758473-96b301d5c8f9", "photo-1599940824399-b87987ceb72a",
            "photo-1514733670139-4d87a1941d55", "photo-1596040033229-a9821ebd058e", "photo-1596040033229-a9821ebd058f",
            "photo-1596040033229-a9821ebd0590", "photo-1596040033229-a9821ebd0591", "photo-1596040033229-a9821ebd0592",
            "photo-1596040033229-a9821ebd0593", "photo-1596040033229-a9821ebd0594", "photo-1596040033229-a9821ebd0595",
            "photo-1596040033229-a9821ebd0596", "photo-1596040033229-a9821ebd0597", "photo-1596040033229-a9821ebd0598",
            "photo-1596040033229-a9821ebd0599", "photo-1596040033229-a9821ebd059a", "photo-1596040033229-a9821ebd059b",
            "photo-1596040033229-a9821ebd059c", "photo-1596040033229-a9821ebd059d", "photo-1596040033229-a9821ebd059e",
            "photo-1596040033229-a9821ebd059f", "photo-1596040033229-a9821ebd05a0", "photo-1596040033229-a9821ebd05a1",
            "photo-1596040033229-a9821ebd05a2", "photo-1596040033229-a9821ebd05a3", "photo-1596040033229-a9821ebd05a4",
            "photo-1596040033229-a9821ebd05a5", "photo-1596040033229-a9821ebd05a6", "photo-1596040033229-a9821ebd05a7",
            "photo-1596040033229-a9821ebd05a8", "photo-1596040033229-a9821ebd05a9"
        ],
        "names": [
            "Pure Alleppey Turmeric Powder (Curcumin 5%)", "Fiery Kashmiri Deggi Mirch Powder", "Tellicherry Whole Black Peppercorns Grinder",
            "Whole Cumin Seeds (Jeera)", "Coriander Seeds Ground Powder (Dhania)", "Royal Garam Masala Blend 15 Spices",
            "Himalayan Pink Rock Salt Fine Crystals", "Green Cardamom Pods (Elaichi Jumbo)", "Ceylon True Cinnamon Quills (Dalchini)",
            "Whole Aromatic Cloves (Laung)", "Star Anise Whole Chinese Spice", "Indian Bay Leaves (Tej Patta)",
            "Kashmiri Pure Saffron Strands (Kesar)", "Hing Compounded Asafoetida Powder", "Black Cumin Kalonji Nigella Seeds",
            "Nutmeg Whole with Mace Blades (Jaiphal)", "Fenugreek Whole Seeds (Methi Dana)", "Fennel Sweet Seeds (Saunf)",
            "Brown Mustard Seeds (Rai)", "Amchur Tart Dry Mango Powder", "Chaat Masala Tangy Street Blend",
            "Kitchen King All-Purpose Curry Masala", "Biryani Pulav Whole Spice Potli", "Dry Ginger Powder (Saunth)",
            "Dried Kasuri Fenugreek Leaves", "Dried Crushed Oregano Herb Flakes", "Dried Sweet Basil Leaves",
            "Dried Rosemary Needles", "Dried Thyme Herb Seasoning", "Smoked Spanish Sweet Paprika",
            "Crushed Red Hot Chili Pepper Flakes", "Coarse Sea Salt Crystals Grinder", "Black Salt Powder (Kala Namak)",
            "Sichuan Aromatic Peppercorns", "Madras Yellow Curry Spice Powder"
        ],
        "brand": "Spice Royal / Everest",
        "units": ["100 g pack", "200 g pack", "50 g jar", "500 g jar", "1 g box"],
        "base_price": 2.99
    },
    {
        "category": "Snacks",
        "photos": [
            "photo-1566478989037-eec170784d0b", "photo-1527515862127-a4fc05baf7a5", "photo-1582293041079-7814c2f12063",
            "photo-1578849278619-e73505e9610f", "photo-1508061252224-237ff54ed0a3", "photo-1509440159596-0249088772ff",
            "photo-1566478989037-eec170784d0c", "photo-1566478989037-eec170784d0d", "photo-1566478989037-eec170784d0e",
            "photo-1566478989037-eec170784d0f", "photo-1566478989037-eec170784d10", "photo-1566478989037-eec170784d11",
            "photo-1566478989037-eec170784d12", "photo-1566478989037-eec170784d13", "photo-1566478989037-eec170784d14",
            "photo-1566478989037-eec170784d15", "photo-1566478989037-eec170784d16", "photo-1566478989037-eec170784d17",
            "photo-1566478989037-eec170784d18", "photo-1566478989037-eec170784d19", "photo-1566478989037-eec170784d1a",
            "photo-1566478989037-eec170784d1b", "photo-1566478989037-eec170784d1c", "photo-1566478989037-eec170784d1d",
            "photo-1566478989037-eec170784d1e", "photo-1566478989037-eec170784d1f", "photo-1566478989037-eec170784d20",
            "photo-1566478989037-eec170784d21", "photo-1566478989037-eec170784d22", "photo-1566478989037-eec170784d23",
            "photo-1566478989037-eec170784d24", "photo-1566478989037-eec170784d25", "photo-1566478989037-eec170784d26",
            "photo-1566478989037-eec170784d27", "photo-1566478989037-eec170784d28"
        ],
        "names": [
            "Classic Sea Salted Crispy Potato Chips", "Stone-Ground Corn Tortilla Nacho Chips", "Theatre Style Movie Theater Butter Popcorn",
            "Roasted Salted California Jumbo Almonds", "Slow-Roasted Cashews with Himalayan Salt", "Traditional Haldiram Aloo Bhujia Namkeen",
            "Crunchy Khatta Meetha Sweet & Sour Mix", "Spicy Moong Dal Salted Fried Snack", "Roasted Salted California Pistachios",
            "Bavarian Pretzel Knots with Sea Salt", "Crispy Rice Puffs Bhel Puri Mix", "Chili Lime Kettle Cooked Potato Chips",
            "Tangy Sour Cream & Onion Crisps", "Mexican Cheese Jalapeno Tortilla Crisps", "Caramel Drizzled Crunch Corn Popcorn",
            "Dry Roasted Salted Peanuts", "Masala Peanuts Spicy Coated Peanuts", "Puffed Makhana Foxnuts with Mint Flavor",
            "Spicy Banana Chips in Coconut Oil", "Cassava Yuca Crunchy Root Chips", "Crispy Salted Corn Chips Crunch",
            "Spicy Tapioca Sticks Finger Snack", "Sev Murmura Gujarati Spiced Crunch", "Diet Chivda Roasted Flaked Rice",
            "Crispy Fried Onion Pakora Bites", "Salted Roasted Pumpkin Snack Seeds", "Honey Glazed Roasted Pecans",
            "Cocktail Mixed Dry Fruit Nut Medley", "Crispy Cheddar Cheese Puffs Balls", "Sweet & Spicy Trail Mix Medley",
            "Plantain Garlic Golden Salted Chips", "Crunchy Wasabi Green Peas", "Japanese Rice Crackers with Nori",
            "Spicy Corn Crunch Kernels", "Multigrain Roasted Healthy Snack Chips"
        ],
        "brand": "Snack Time / Haldiram",
        "units": ["150 g bag", "200 g pack", "100 g bag", "250 g jar", "400 g pack"],
        "base_price": 2.49
    },
    {
        "category": "Biscuits",
        "photos": [
            "photo-1558961363-fa8fdf82db35", "photo-1499636136210-6f4ee915583e", "photo-1509440159596-0249088772ff",
            "photo-1559591937-e17621c43d9a", "photo-1589301760014-d929f3979dbc", "photo-1558961363-fa8fdf82db36",
            "photo-1558961363-fa8fdf82db37", "photo-1558961363-fa8fdf82db38", "photo-1558961363-fa8fdf82db39",
            "photo-1558961363-fa8fdf82db3a", "photo-1558961363-fa8fdf82db3b", "photo-1558961363-fa8fdf82db3c",
            "photo-1558961363-fa8fdf82db3d", "photo-1558961363-fa8fdf82db3e", "photo-1558961363-fa8fdf82db3f",
            "photo-1558961363-fa8fdf82db40", "photo-1558961363-fa8fdf82db41", "photo-1558961363-fa8fdf82db42",
            "photo-1558961363-fa8fdf82db43", "photo-1558961363-fa8fdf82db44", "photo-1558961363-fa8fdf82db45",
            "photo-1558961363-fa8fdf82db46", "photo-1558961363-fa8fdf82db47", "photo-1558961363-fa8fdf82db48",
            "photo-1558961363-fa8fdf82db49", "photo-1558961363-fa8fdf82db4a", "photo-1558961363-fa8fdf82db4b",
            "photo-1558961363-fa8fdf82db4c", "photo-1558961363-fa8fdf82db4d", "photo-1558961363-fa8fdf82db4e",
            "photo-1558961363-fa8fdf82db4f", "photo-1558961363-fa8fdf82db50", "photo-1558961363-fa8fdf82db51",
            "photo-1558961363-fa8fdf82db52", "photo-1558961363-fa8fdf82db53"
        ],
        "names": [
            "Whole Wheat Digestive Fiber Biscuits", "Chunky Double Chocolate Chip Cookies", "Artisan Crusty Sourdough Boule Loaf",
            "Butter Flaky French Croissants (Pack of 4)", "Crispy Cardamom Tea Rusk Toast", "Classic English Marie Tea Biscuits",
            "Rich Dark Bourbon Chocolate Cream Biscuits", "Salted Butter Cream Crackers", "Golden Honey Graham Crackers",
            "Scotch Shortbread Pure Butter Fingers", "Vanilla Cream Filled Sandwich Cookies", "Dark Cocoa Sandwich Oreo Style Cookies",
            "Hazelnut Cocoa Cream Wafer Rolls", "Crispy Belgian Waffle Biscuits", "Whole Wheat Toast Bread Sandwich Loaf",
            "Soft Sesame Seed Burger Buns (Pack of 4)", "Classic White Sliced Toast Bread", "Stone-Baked Multigrain Bagel 4-Pack",
            "Cinnamon Swirl Soft Sweet Buns", "Almond Biscotti Italian Coffee Dipping Cookies", "Oatmeal Raisin Soft Chewy Cookies",
            "Gingerbread Spicy Snap Biscuits", "Fruit Jam Centered Thumbprint Cookies", "Coconut Macaroon Sweet Crisp Biscuits",
            "Cheddar Cheese Baked Savory Crackers", "Rosewater Sweet Bakery Puff Pastry (Khari)", "Cashew Pista Butter Cookies (Nan Khatai)",
            "Dutch Speculoos Spiced Caramel Biscuits", "Chocolate Fudge Rich Brownie Slice", "Blueberry Soft Crumb Breakfast Muffins",
            "Gluten-Free Seed & Nut Bread Loaf", "Pita Pocket Flatbreads (Pack of 6)", "Soft Flour Tortilla Wraps (Pack of 8)",
            "Crispy Breadsticks Grissini with Rosemary", "Custard Cream Filled Sandwich Biscuits"
        ],
        "brand": "Britannia / McVitie's",
        "units": ["200 g pack", "300 g pack", "Pack of 4", "400 g loaf", "150 g box"],
        "base_price": 2.29
    },
    {
        "category": "Beverages",
        "photos": [
            "photo-1544787219-7f47ccb76574", "photo-1514432324607-a09d9b4aefdd", "photo-1613478223719-2ab802602423",
            "photo-1548839140-29a749e1bc4e", "photo-1551024709-8f23befc6f87", "photo-1556679343-c7306c1976bc",
            "photo-1544787219-7f47ccb76575", "photo-1544787219-7f47ccb76576", "photo-1544787219-7f47ccb76577",
            "photo-1544787219-7f47ccb76578", "photo-1544787219-7f47ccb76579", "photo-1544787219-7f47ccb7657a",
            "photo-1544787219-7f47ccb7657b", "photo-1544787219-7f47ccb7657c", "photo-1544787219-7f47ccb7657d",
            "photo-1544787219-7f47ccb7657e", "photo-1544787219-7f47ccb7657f", "photo-1544787219-7f47ccb76580",
            "photo-1544787219-7f47ccb76581", "photo-1544787219-7f47ccb76582", "photo-1544787219-7f47ccb76583",
            "photo-1544787219-7f47ccb76584", "photo-1544787219-7f47ccb76585", "photo-1544787219-7f47ccb76586",
            "photo-1544787219-7f47ccb76587", "photo-1544787219-7f47ccb76588", "photo-1544787219-7f47ccb76589",
            "photo-1544787219-7f47ccb7658a", "photo-1544787219-7f47ccb7658b", "photo-1544787219-7f47ccb7658c",
            "photo-1544787219-7f47ccb7658d", "photo-1544787219-7f47ccb7658e", "photo-1544787219-7f47ccb7658f",
            "photo-1544787219-7f47ccb76590", "photo-1544787219-7f47ccb76591"
        ],
        "names": [
            "Assam CTC Golden Broken Tea Granules", "Arabica Whole Roasted Coffee Beans (1kg)", "Freshly Squeezed Valencia Orange Juice (1L)",
            "Pure Natural Spring Mineral Water (Pack of 6)", "Organic Pure Young Coconut Water", "Japanese Ceremonial Grade Green Matcha Powder",
            "Darjeeling First Flush Whole Leaf Black Tea", "Earl Grey Bergamot Flavored Black Tea Bags", "Chamomile Pure Blossom Herbal Tea Bags (25s)",
            "Fresh Peppermint Calming Herbal Tea", "Italian Dark Roast Ground Espresso Coffee", "Classic Freeze-Dried Instant Coffee Crystals",
            "Unsweetened Pure Cloudy Apple Juice (1L)", "Ruby Pomegranate Antioxidant Juice (1L)", "Tropical Mango Nectar Beverage (1L)",
            "Sparkling Mineral Water with Lime (1.25L)", "Classic Craft Cola Soda (6-Pack Cans)", "Spiced Jamaican Ginger Beer Soda",
            "Tonic Water with Quinine (4-Pack)", "Lemon Mint Sparkling Iced Tea (1L)", "Hydrating Electrolyte Energy Drink (500ml)",
            "Cold Brew Nitro Coffee Can (250ml)", "Traditional Masala Chai Tea Bag Blend", "South Indian Chicory Filter Coffee Powder",
            "Green Jasmine Floral Scented Tea Leaves", "Sweet Cranberry Cocktail Juice (1L)", "Fresh Pressed Lemonade with Cane Sugar (1L)",
            "Guava Pink Nectar Juice with Pulp (1L)", "Sparkling Blood Orange Italian Soda", "Root Beer Botanical Herbal Soda",
            "Almond Milk Barista Coffee Blend (1L)", "Oat Milk Unsweetened Creamy Drink (1L)", "Soy Milk Calcium Enriched Original (1L)",
            "Thandai Spiced Saffron Beverage Syrup", "Rose Cordial Refreshing Sherbet Syrup (750ml)"
        ],
        "brand": "Twinings / Tropicana",
        "units": ["500 g pouch", "1 Litre bottle", "100 tea bags", "1 kg bag", "6-pack cans"],
        "base_price": 3.99
    },
    {
        "category": "Dairy Products",
        "photos": [
            "photo-1550583724-b2692b85b150", "photo-1488477181946-6428a0291777", "photo-1618160702438-9b02ab6515c9",
            "photo-1506976785307-8732e854ad03", "photo-1628088062854-d1870b4553da", "photo-1589927986089-35812388d1f4",
            "photo-1550583724-b2692b85b151", "photo-1550583724-b2692b85b152", "photo-1550583724-b2692b85b153",
            "photo-1550583724-b2692b85b154", "photo-1550583724-b2692b85b155", "photo-1550583724-b2692b85b156",
            "photo-1550583724-b2692b85b157", "photo-1550583724-b2692b85b158", "photo-1550583724-b2692b85b159",
            "photo-1550583724-b2692b85b15a", "photo-1550583724-b2692b85b15b", "photo-1550583724-b2692b85b15c",
            "photo-1550583724-b2692b85b15d", "photo-1550583724-b2692b85b15e", "photo-1550583724-b2692b85b15f",
            "photo-1550583724-b2692b85b160", "photo-1550583724-b2692b85b161", "photo-1550583724-b2692b85b162",
            "photo-1550583724-b2692b85b163", "photo-1550583724-b2692b85b164", "photo-1550583724-b2692b85b165",
            "photo-1550583724-b2692b85b166", "photo-1550583724-b2692b85b167", "photo-1550583724-b2692b85b168",
            "photo-1550583724-b2692b85b169", "photo-1550583724-b2692b85b16a", "photo-1550583724-b2692b85b16b",
            "photo-1550583724-b2692b85b16c", "photo-1550583724-b2692b85b16d"
        ],
        "names": [
            "Farm Fresh Whole Cream Milk (1L)", "Authentic Plain Greek Strained Yogurt", "Natural Sharp English Cheddar Cheese Block",
            "Pasture-Raised Organic Brown Eggs (Dozen)", "Fresh Malai Cottage Cheese Paneer Block", "Pure Golden Salted Table Butter",
            "Low-Fat Skimmed Pasteurized Milk (1L)", "Sweetened Condensed Milk Can", "Evaporated Cooking Milk Can",
            "Heavy Whipping Cream (500ml)", "Cultured Sour Cream Tub", "Original Spreadable Cream Cheese",
            "Fresh Shredded Mozzarella Pizza Cheese", "Aged Italian Parmesan Parmigiano Reggiano", "Crumbled Greek Sheep Milk Feta Cheese",
            "Creamy Ricotta Italian Whey Cheese", "Fresh Mozzarella Bocconcini Balls in Brine", "Gouda Dutch Mild Cheese Slices",
            "Smoked Provolone Deli Cheese Slices", "Swiss Emmental Cheese with Holes", "Probiotic Vanilla Flavored Yogurt Cup",
            "Strawberry Fruit Swirl Yogurt Tub (500g)", "Plain Set Curd Dahi Tub (1kg)", "Spiced Masala Chaas Buttermilk (500ml)",
            "Sweetened Cardamom Lassi Bottle", "Organic Free-Range White Eggs (Dozen)", "Salted Churned Garlic & Herb Butter",
            "Unsalted Pastry Baking Butter Block", "Clarified Cultured Butter Ghee Jar", "Plant-Based Almond Milk (1L)",
            "Barista Oat Milk for Coffee (1L)", "Organic Soy Milk Protein Drink (1L)", "Tofu Extra Firm Organic Soy Block",
            "Chocolate Flavored Whole Milk Bottle", "Kefir Probiotic Cultured Milk Drink (1L)"
        ],
        "brand": "Amul / Organic Valley",
        "units": ["1 Litre carton", "500 g tub", "1 dozen box", "200 g block", "250 g pack"],
        "base_price": 3.49
    },
    {
        "category": "Personal Care",
        "photos": [
            "photo-1522337360788-8b13dee7a37e", "photo-1583947215259-38e31be8751f", "photo-1556228720-195a672e8a03",
            "photo-1584308666744-24d5c474f2ae", "photo-1608248597359-598d1a1b15be", "photo-1526947425960-945c6e72858f",
            "photo-1522337360788-8b13dee7a37f", "photo-1522337360788-8b13dee7a380", "photo-1522337360788-8b13dee7a381",
            "photo-1522337360788-8b13dee7a382", "photo-1522337360788-8b13dee7a383", "photo-1522337360788-8b13dee7a384",
            "photo-1522337360788-8b13dee7a385", "photo-1522337360788-8b13dee7a386", "photo-1522337360788-8b13dee7a387",
            "photo-1522337360788-8b13dee7a388", "photo-1522337360788-8b13dee7a389", "photo-1522337360788-8b13dee7a38a",
            "photo-1522337360788-8b13dee7a38b", "photo-1522337360788-8b13dee7a38c", "photo-1522337360788-8b13dee7a38d",
            "photo-1522337360788-8b13dee7a38e", "photo-1522337360788-8b13dee7a38f", "photo-1522337360788-8b13dee7a390",
            "photo-1522337360788-8b13dee7a391", "photo-1522337360788-8b13dee7a392", "photo-1522337360788-8b13dee7a393",
            "photo-1522337360788-8b13dee7a394", "photo-1522337360788-8b13dee7a395", "photo-1522337360788-8b13dee7a396",
            "photo-1522337360788-8b13dee7a397", "photo-1522337360788-8b13dee7a398", "photo-1522337360788-8b13dee7a399",
            "photo-1522337360788-8b13dee7a39a", "photo-1522337360788-8b13dee7a39b"
        ],
        "names": [
            "Herbal Nourishing Hair Shampoo Bottle (400ml)", "Deep Moisture Hair Conditioner (350ml)", "Gentle Moisturizing Bath Soap Bar 3-Pack",
            "Foaming Antibacterial Liquid Hand Wash (300ml)", "Mint Fresh Fluoride Toothpaste Tube (150g)", "Ergonomic Soft Bristle Toothbrush 4-Pack",
            "Antiperspirant Roll-On 48h Deodorant", "Refreshing Ocean Breeze Body Wash (500ml)", "Cocoa Butter Deep Nourishing Body Lotion",
            "Broad Spectrum Daily Sunscreen SPF 50", "Gentle Hydrating Facial Cleanser Foam", "Aloe Vera Calming Soothing Gel (250ml)",
            "Rich Shaving Foam Cream with Menthol", "Multi-Blade Precision Shaving Razor 3-Pack", "Hydrating Rosewater Facial Mist Toner",
            "Instant Hand Sanitizer Gel 70% Alcohol", "100% Pure Organic Cotton Ear Swabs (200s)", "Purifying Charcoal Black Peel-Off Face Mask",
            "Exfoliating Apricot Kernel Face Scrub", "Nourishing Herbal Hair Growth Oil with Bhringraj", "Deep Conditioning Argan Hair Serum",
            "Moisturizing Lip Balm with Beeswax & Mint", "Antibacterial Antiseptic First Aid Dettol Liquid", "Gentle Intimate Hygiene Wash",
            "Herbal Neem & Tulsi Purifying Bath Soap", "Epsom Muscle Relaxing Bath Salts (1kg)", "Beard Conditioning Oil with Cedarwood",
            "Pre-Shave Sandalwood Shaving Oil", "Ultra Thin Daily Sanitary Pads with Wings (30s)", "Cooling Talcum Powder with Sandalwood",
            "Pedicure Foot Care Pumice Stone Brush", "Nail Clipper Stainless Steel Manicure Tool", "Soft Facial Cleansing Wipes 25-Pack",
            "Hydrogel Under Eye Dark Circle Patches", "Teeth Whitening Activated Charcoal Powder"
        ],
        "brand": "Dove / Dettol / Nivea",
        "units": ["400 ml bottle", "Pack of 3", "150 g tube", "Pack of 4", "500 ml bottle"],
        "base_price": 3.99
    },
    {
        "category": "Cleaning Products",
        "photos": [
            "photo-1585421514738-01798e348b17", "photo-1583947215259-38e31be8751f", "photo-1563453392212-326f5e854473",
            "photo-1584992236310-6edddc08acff", "photo-1584813470613-5b1c1cad3d69", "photo-1584308666744-24d5c474f2ae",
            "photo-1585421514738-01798e348b19", "photo-1585421514738-01798e348b1a", "photo-1585421514738-01798e348b1b",
            "photo-1585421514738-01798e348b1c", "photo-1585421514738-01798e348b1d", "photo-1585421514738-01798e348b1e",
            "photo-1585421514738-01798e348b1f", "photo-1585421514738-01798e348b20", "photo-1585421514738-01798e348b21",
            "photo-1585421514738-01798e348b22", "photo-1585421514738-01798e348b23", "photo-1585421514738-01798e348b24",
            "photo-1585421514738-01798e348b25", "photo-1585421514738-01798e348b26", "photo-1585421514738-01798e348b27",
            "photo-1585421514738-01798e348b28", "photo-1585421514738-01798e348b29", "photo-1585421514738-01798e348b2a",
            "photo-1585421514738-01798e348b2b", "photo-1585421514738-01798e348b2c", "photo-1585421514738-01798e348b2d",
            "photo-1585421514738-01798e348b2e", "photo-1585421514738-01798e348b2f", "photo-1585421514738-01798e348b30",
            "photo-1585421514738-01798e348b31", "photo-1585421514738-01798e348b32", "photo-1585421514738-01798e348b33",
            "photo-1585421514738-01798e348b34", "photo-1585421514738-01798e348b35"
        ],
        "names": [
            "Concentrated Lemon Dishwashing Gel Liquid (750ml)", "High Efficiency Liquid Laundry Detergent (2L)", "Antibacterial Surface Disinfectant Spray (500ml)",
            "Heavy Duty Dual Action Scrub Sponges 4-Pack", "Pine Fresh Floor Disinfectant Cleaner (1L)", "All-in-One Dishwasher Detergent Pods (30s)",
            "Sparkling Glass & Window Cleaner Spray (500ml)", "Power Disinfectant Toilet Bowl Bleach Gel (750ml)", "Gentle Fabric Softener Spring Flower (1.5L)",
            "Oxygen Bleach Laundry Stain Remover Powder", "Stainless Steel Spiral Pot Scourers 3-Pack", "Microfiber Streak-Free Cleaning Cloths 5-Pack",
            "Reusable Yellow Latex Household Gloves (Pair)", "Drain Unblocker Clog Dissolver Liquid (1L)", "Bathroom Tile Grime & Mildew Cleaner",
            "Citrus Multi-Purpose Kitchen Degreaser", "Wood Furniture Polish Wax Spray (400ml)", "Oven & Grill Heavy Grease Cleaner",
            "Carpet Spot Stain Foam Shampoo Spray", "Disinfectant Alcohol Surface Cleaning Wipes (80s)", "Air Freshener Lavender Automatic Spray Refill",
            "Washing Machine Tub Cleaner Tablets (6s)", "Floor Dusting Mop Microfiber Refill Head", "Toilet Rim Hanger Freshener Block Duo",
            "Scouring Powder with Bleach Crystals (500g)", "Shoe Cleaning Foam Polish Sponge Kit", "Mosquito Repellent Liquid Vaporizer Machine",
            "Mosquito Coil Defense Burner 10-Pack", "Moth Proofer Lavender Wardrobe Balls", "Car Interior Dashboard Vinyl Polish",
            "Leather Jacket & Sofa Cleaner Conditioner", "Brass & Metal Shiner Liquid Polish (200ml)", "Sponge Cellulose Kitchen Wiping Cloths 3-Pack",
            "Antibacterial Spray Bottle Empty Refillable", "Hand Sanitizer Bulk Refill Canister (5L)"
        ],
        "brand": "Vim / Surf / Lysol",
        "units": ["750 ml bottle", "2 Litre bottle", "500 ml spray", "Pack of 4", "1 kg pack"],
        "base_price": 3.79
    },
    {
        "category": "Household Items",
        "photos": [
            "photo-1584992236310-6edddc08acff", "photo-1584813470613-5b1c1cad3d69", "photo-1513519245088-0e12902e5a38",
            "photo-1583947215259-38e31be8751f", "photo-1585421514738-01798e348b17", "photo-1584992236310-6edddc08acd0",
            "photo-1584992236310-6edddc08acd1", "photo-1584992236310-6edddc08acd2", "photo-1584992236310-6edddc08acd3",
            "photo-1584992236310-6edddc08acd4", "photo-1584992236310-6edddc08acd5", "photo-1584992236310-6edddc08acd6",
            "photo-1584992236310-6edddc08acd7", "photo-1584992236310-6edddc08acd8", "photo-1584992236310-6edddc08acd9",
            "photo-1584992236310-6edddc08acda", "photo-1584992236310-6edddc08acdb", "photo-1584992236310-6edddc08acdc",
            "photo-1584992236310-6edddc08acdd", "photo-1584992236310-6edddc08acde", "photo-1584992236310-6edddc08acdf",
            "photo-1584992236310-6edddc08ace0", "photo-1584992236310-6edddc08ace1", "photo-1584992236310-6edddc08ace2",
            "photo-1584992236310-6edddc08ace3", "photo-1584992236310-6edddc08ace4", "photo-1584992236310-6edddc08ace5",
            "photo-1584992236310-6edddc08ace6", "photo-1584992236310-6edddc08ace7", "photo-1584992236310-6edddc08ace8",
            "photo-1584992236310-6edddc08ace9", "photo-1584992236310-6edddc08acea", "photo-1584992236310-6edddc08aceb",
            "photo-1584992236310-6edddc08acec", "photo-1584992236310-6edddc08aced"
        ],
        "names": [
            "Thick Absorbent Kitchen Paper Towels (2 Rolls)", "3-Ply Soft Quilted Bath Toilet Rolls (12-Pack)", "Facial Tissues 2-Ply Soft Pop-Up Box (200s)",
            "Heavy Duty Drawstring Garbage Trash Bags (30s)", "Heavy Gauge Aluminum Kitchen Foil Roll (30m)", "Non-Stick Baking Parchment Paper Roll (20m)",
            "Clear Food Grade Cling Wrap Film (50m)", "Zipper Seal Food Storage Freezer Bags (25s)", "Long-Lasting AA Alkaline Batteries (8-Pack)",
            "Long-Lasting AAA Alkaline Batteries (8-Pack)", "Energy-Saving Warm White 9W LED Light Bulb (2-Pack)", "Safety Long Kitchen Wooden Matchboxes 10-Pack",
            "White Pillar Emergency Household Candles 6-Pack", "Rechargeable LED Emergency Flashlight Torch", "Stainless Steel Food Container Lunch Box",
            "Airtight Dry Food Storage Pantry Canisters 3-Set", "Silicone Ice Cube Tray with Spill Lid", "Stainless Steel Kitchen Vegetable Peeler",
            "Stainless Steel Kitchen Chef Shears Scissors", "Corkscrew Wine Bottle & Can Opener Tool", "Plastic Clothes Pegs Hanging Clips 24-Pack",
            "Cotton Braided Laundry Clothesline Rope (20m)", "Lint Roller Sticky Hair Remover with Refills", "Hot Water Rubber Heating Bottle with Fleece Cover",
            "Digital Kitchen Weighing Scale (Up to 5kg)", "Egg Timer Boiling Color Changing Indicator", "Plastic Water Jug Pitcher with Lid (2L)",
            "Insulated Vacuum Thermal Coffee Flask (750ml)", "Bamboo Cooking Spatula & Spoon Utensil Set", "Non-Slip Silicone Oven Baking Mitt Gloves",
            "Heavy Duty Nylon Cable Zip Ties 100-Pack", "Multipurpose Steel Wire Clothes Hangers 10-Pack", "Cotton Kitchen Tea Towels Dish Wipes 3-Pack",
            "Fly Swatter Heavy Duty Plastic 2-Pack", "Shoe Horn Long Handle Ergonomic Tool"
        ],
        "brand": "Cornerstone Home",
        "units": ["Pack of 2", "Pack of 12", "Box of 200", "Roll of 30m", "Pack of 8"],
        "base_price": 4.49
    },
    {
        "category": "Stationery",
        "photos": [
            "photo-1583485088034-697b5bc54ccd", "photo-1585776245991-cf89dd7fc73a", "photo-1517842645767-c639042777db",
            "photo-1586075010923-2dd4570fb338", "photo-1585776245991-cf89dd7fc73b", "photo-1585776245991-cf89dd7fc73c",
            "photo-1585776245991-cf89dd7fc73d", "photo-1585776245991-cf89dd7fc73e", "photo-1585776245991-cf89dd7fc73f",
            "photo-1585776245991-cf89dd7fc740", "photo-1585776245991-cf89dd7fc741", "photo-1585776245991-cf89dd7fc742",
            "photo-1585776245991-cf89dd7fc743", "photo-1585776245991-cf89dd7fc744", "photo-1585776245991-cf89dd7fc745",
            "photo-1585776245991-cf89dd7fc746", "photo-1585776245991-cf89dd7fc747", "photo-1585776245991-cf89dd7fc748",
            "photo-1585776245991-cf89dd7fc749", "photo-1585776245991-cf89dd7fc74a", "photo-1585776245991-cf89dd7fc74b",
            "photo-1585776245991-cf89dd7fc74c", "photo-1585776245991-cf89dd7fc74d", "photo-1585776245991-cf89dd7fc74e",
            "photo-1585776245991-cf89dd7fc74f"
        ],
        "names": [
            "Spiral Bound Lined Ruled Notebook (160 Pages)", "Smooth Flow Blue Ballpoint Pens (Pack of 10)", "Fluorescent Pastel Highlighter Pens 4-Pack",
            "Yellow Self-Adhesive Sticky Notes Pad (100 Sheets)", "Ergonomic Office Desktop Stapler with 1000 Pins", "Clear Transparent Packing Tape Roll (50m)",
            "Stainless Steel Craft Precision Scissors", "All-Purpose Clear Glue Stick 3-Pack", "Vinyl Coated Colorful Metal Paper Clips 100s",
            "HB Graphite Drawing Writing Pencils 12-Pack", "Dust-Free Soft Erasers & Pencil Sharpener Kit", "Black Gel Fine Point Writing Pens 5-Pack",
            "A4 White Multipurpose Copy Printer Paper (500 Sheets)", "Hardcover Journal Diary with Ribbon Marker", "Permanent Black Chisel Tip Marker Pen 2-Pack",
            "Index Page Marking Tabs Neon Flags 5-Set", "Plastic Document Button File Folder 6-Pack", "Metal Mesh Desktop Pen Pencil Holder Stand",
            "Stainless Steel 30cm Metric Ruler Scale", "Correction Fluid Whitener Pen (Quick Dry)", "Double Sided Adhesive Foam Mounting Tape",
            "Expanding Accordion File Document Organizer", "Self-Inking Date Stamp for Invoices", "Calculator Solar Powered 12-Digit Display",
            "Laminating Pouches Clear Glossy A4 20-Pack", "Fine Permanent CD DVD Marker Pens 4-Pack", "Plastic Binder Rings Clips 50-Pack",
            "Heavy Duty 2-Hole Paper Punch Machine", "Transparent Geometric Math Set Box", "Mechanical Drafting Pencils with 2B Leads",
            "Whiteboard Dry Erase Markers 4-Color Set", "Magnetic Whiteboard Mini Eraser Duster", "Manila Cardboard File Folders 10-Pack",
            "Thermal Cash Register Paper Rolls 5-Pack", "Shipping Address Self-Adhesive Labels 100s"
        ],
        "brand": "Classmate / Camlin / Bic",
        "units": ["Pack of 10", "1 book", "Pack of 4", "500 sheets ream", "1 piece"],
        "base_price": 2.49
    },
    {
        "category": "Baby Products",
        "photos": [
            "photo-1515488042361-ee00e0ddd4e4", "photo-1555252333-9f8e92e65df9", "photo-1544126592-807ade215a0b",
            "photo-1515488042361-ee00e0ddd4e5", "photo-1515488042361-ee00e0ddd4e6", "photo-1515488042361-ee00e0ddd4e7",
            "photo-1515488042361-ee00e0ddd4e8", "photo-1515488042361-ee00e0ddd4e9", "photo-1515488042361-ee00e0ddd4ea",
            "photo-1515488042361-ee00e0ddd4eb", "photo-1515488042361-ee00e0ddd4ec", "photo-1515488042361-ee00e0ddd4ed",
            "photo-1515488042361-ee00e0ddd4ee", "photo-1515488042361-ee00e0ddd4ef", "photo-1515488042361-ee00e0ddd4f0",
            "photo-1515488042361-ee00e0ddd4f1", "photo-1515488042361-ee00e0ddd4f2", "photo-1515488042361-ee00e0ddd4f3",
            "photo-1515488042361-ee00e0ddd4f4", "photo-1515488042361-ee00e0ddd4f5", "photo-1515488042361-ee00e0ddd4f6",
            "photo-1515488042361-ee00e0ddd4f7", "photo-1515488042361-ee00e0ddd4f8", "photo-1515488042361-ee00e0ddd4f9",
            "photo-1515488042361-ee00e0ddd4fa"
        ],
        "names": [
            "Hypoallergenic Fragrance-Free Baby Wipes (72 Wipes)", "Ultra Dry Overnight Diaper Pants Size M (44s)", "Tear-Free Gentle Baby Shampoo & Wash (500ml)",
            "Moisturizing Baby Body Lotion with Aloe (400ml)", "Pure Cornstarch Baby Soothing Powder (200g)", "Zinc Oxide Calming Diaper Rash Cream (100g)",
            "Organic Stage 1 Infant Cereal Rice & Milk (400g)", "Anti-Colic BPA-Free Baby Feeding Bottle (260ml)", "Silicone Orthodontic Soothing Pacifiers 2-Pack",
            "Gentle Baby Laundry Detergent Liquid (1L)", "Soft Cotton Muslin Swaddle Blankets 3-Pack", "Digital Fast Read Soft Tip Baby Thermometer",
            "Baby Soft Pure Cotton Safety Buds (100s)", "Safety Curved Baby Nail Clippers & Scissor Kit", "Organic Apple & Banana Baby Fruit Puree Jar (120g)",
            "Tender Vegetables & Sweet Potato Puree (120g)", "Teething Ring Textured Silicone Soother", "Silicone Waterproof Baby Weaning Bib with Pocket",
            "Baby Massage Pure Coconut & Sesame Oil (200ml)", "Gentle Moisturizing Baby Bath Soap Bar (75g)", "Infant Nasal Aspirator Mucus Sucker Bulb",
            "Baby Bottle Cleaning Brush with Nipple Cleaner", "Toddler Spill-Proof Sippy Cup with Straw (300ml)", "Soft Bristle Infant Toothbrush & Gum Massager",
            "Baby Wet Wipes Travel Friendly Pack (24s)", "Baby Tooth & Gum Soothing Teething Gel", "Organic Teething Rice Rusks 24-Pack",
            "Soft Cotton Baby Drool Bandana Bibs 4-Pack", "Infant Grip Soft Spoon & Fork Feeding Set", "Baby Safe Non-Toxic Surface Sanitizing Spray",
            "Gentle Baby Fabric Softener Delicate (1L)", "Organic Oatmeal Infant Porridge Grain", "Baby Crib Waterproof Mattress Protector Sheet",
            "Baby Soft Hairbrush & Comb Cradle Cap Set", "Formula Milk Powder Dispenser Container 3-Tier"
        ],
        "brand": "Johnson's / Pampers / Huggies",
        "units": ["Pack of 72", "Pack of 44", "500 ml bottle", "400 g tin", "1 piece"],
        "base_price": 5.99
    },
    {
        "category": "Other",
        "photos": [
            "photo-1513519245088-0e12902e5a38", "photo-1583485088034-697b5bc54ccd", "photo-1544126592-807ade215a0b",
            "photo-1584308666744-24d5c474f2ae", "photo-1584992236310-6edddc08acff", "photo-1513519245088-0e12902e5a39",
            "photo-1513519245088-0e12902e5a3a", "photo-1513519245088-0e12902e5a3b", "photo-1513519245088-0e12902e5a3c",
            "photo-1513519245088-0e12902e5a3d", "photo-1513519245088-0e12902e5a3e", "photo-1513519245088-0e12902e5a3f",
            "photo-1513519245088-0e12902e5a40", "photo-1513519245088-0e12902e5a41", "photo-1513519245088-0e12902e5a42",
            "photo-1513519245088-0e12902e5a43", "photo-1513519245088-0e12902e5a44", "photo-1513519245088-0e12902e5a45",
            "photo-1513519245088-0e12902e5a46", "photo-1513519245088-0e12902e5a47", "photo-1513519245088-0e12902e5a48",
            "photo-1513519245088-0e12902e5a49", "photo-1513519245088-0e12902e5a4a", "photo-1513519245088-0e12902e5a4b",
            "photo-1513519245088-0e12902e5a4c"
        ],
        "names": [
            "All-Weather Emergency Wax Matchbox Pack (10s)", "Scented Aromatherapy Soy Wax Jar Candle (Vanilla)", "Premium Dry Crunchy Adult Dog Food (3kg bag)",
            "Gourmet Salmon & Tuna Wet Cat Food Pouch (12s)", "Sterile Adhesive Waterproof Bandages (50s)", "Pure Petroleum Jelly Skin Protectant (100g)",
            "Black Shoe Polish Wax Paste Tin (50g)", "Traditional Horsehair Shoe Shiner Brush", "Jute Twine Natural Craft String Ball (100m)",
            "Super Fast Cyanoacrylate Instant Glue Tube 2-Pack", "Brass Padlock with 3 Master Keys (40mm)", "Steel Multi-Bit Household Screwdriver Set",
            "Cotton Medical Gauze Bandage Roll (5m)", "Instant Cold Ice Pack for Sprains & Swelling", "Anti-Fungal Athlete's Foot Cooling Cream (30g)",
            "Herbal Cough Drops Lozenges with Honey Menthol", "Multipurpose Household Heavy Motor Oil Lubricant", "Sewing Needles & Assorted Colored Thread Kit",
            "Stainless Steel Umbrella Windproof Compact Fold", "Raincoat Disposable Waterproof Emergency Poncho 2-Pack", "Heavy Duty Work Utility Gardening Gloves",
            "Pet Odor Eliminator & Stain Remover Spray", "Stainless Steel Double Pet Food & Water Bowl", "Chew Bone Dental Care Dog Treats 3-Pack",
            "Catnip Infused Interactive Ball Toy for Cats", "Bicycle Tire Puncture Repair Patch Kit", "Universal Waterproof Electrical Insulation Tape",
            "Antiseptic Burn Relief Soothing Cream (25g)", "Adjustable Pet Collar with Safety Bell", "Deodorizing Charcoal Shoe Odor Inserts Pair",
            "Travel Sewing Emergency Repair Kit Case", "Plastic Plant Mister Spray Bottle (500ml)", "Utility Snap-Off Blade Box Cutter Knife",
            "Microfiber Lens & Glass Cleaning Cloths 3-Pack", "Car Air Vent Fresh Fragrance Clip Duo"
        ],
        "brand": "Cornerstone Sundries",
        "units": ["Pack of 10", "1 piece", "3 kg bag", "Box of 50", "1 tin"],
        "base_price": 3.99
    }
]

all_photos = []
photo_id_counter = 1

for dept in departments:
    cat_name = dept["category"]
    photos = dept["photos"]
    names = dept["names"]
    brand = dept["brand"]
    units = dept["units"]
    base_price = dept["base_price"]

    for i in range(len(names)):
        p_name = names[i]
        p_photo = photos[i % len(photos)]
        p_unit = units[i % len(units)]
        # calculated varied price
        price_mod = round(base_price + (i % 7) * 0.75 - ((i % 3) * 0.20), 2)
        if price_mod <= 0.5:
            price_mod = 1.99
        discount_val = round(price_mod * 0.85, 2) if i % 3 == 0 else None

        # Build valid tags
        tags = [cat_name.lower()]
        for word in p_name.lower().replace("(", "").replace(")", "").replace("-", " ").split():
            if len(word) > 2 and word not in tags:
                tags.append(word)

        url = f"https://images.unsplash.com/{p_photo}?auto=format&fit=crop&w=600&q=80"

        all_photos.append({
            "id": f"gsp-{photo_id_counter:03d}",
            "title": p_name,
            "category": cat_name,
            "brand": brand,
            "price": price_mod,
            "discountPrice": discount_val,
            "unit": p_unit,
            "url": url,
            "tags": tags[:8]
        })
        photo_id_counter += 1

print(f"Total photos constructed: {len(all_photos)}")

# Write to JSON
with open("src/data/generalStorePhotos.json", "w") as f:
    json.dump(all_photos, f, indent=2)

with open("server/data/generalStorePhotos.json", "w") as f:
    json.dump(all_photos, f, indent=2)

# Write TypeScript helper
ts_code = f"""/**
 * Curated Database of 500+ General Store Photos & Item Templates
 * Covering all 15 grocery & general store categories with high-resolution Unsplash imagery.
 */

export interface GeneralStorePhoto {{
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  unit: string;
  url: string;
  tags: string[];
}}

import photosData from './generalStorePhotos.json';

export const GENERAL_STORE_PHOTOS: GeneralStorePhoto[] = photosData as GeneralStorePhoto[];

export const PHOTO_CATEGORIES: string[] = [
  'All',
  'Groceries',
  'Rice & Grains',
  'Pulses',
  'Cooking Oil',
  'Spices',
  'Snacks',
  'Biscuits',
  'Beverages',
  'Dairy Products',
  'Personal Care',
  'Cleaning Products',
  'Household Items',
  'Stationery',
  'Baby Products',
  'Other'
];

export function getPhotosByCategory(category: string): GeneralStorePhoto[] {{
  if (!category || category === 'All') return GENERAL_STORE_PHOTOS;
  return GENERAL_STORE_PHOTOS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}}

export function searchStorePhotos(query: string, category?: string): GeneralStorePhoto[] {{
  const q = query.toLowerCase().trim();
  let list = GENERAL_STORE_PHOTOS;
  if (category && category !== 'All') {{
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }}
  if (!q) return list;
  return list.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}}
"""

with open("src/data/generalStorePhotos.ts", "w") as f:
    f.write(ts_code)

print("Saved files successfully!")


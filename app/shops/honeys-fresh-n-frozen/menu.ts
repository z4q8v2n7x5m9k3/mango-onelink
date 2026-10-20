// Mango by Shree Ji Foods - menu updated from the 18-04-2026 printed menu.

export interface MenuItem {
  id: string
  name: string
  description?: string
  quantity: string
  price: string
  category: MenuCategoryKey
  image?: string
}

export type MenuCategoryKey =
  | 'pizza'
  | 'bestSellersCombos'
  | 'burgers'
  | 'sandwiches'
  | 'healthySandwiches'
  | 'momos'
  | 'mojitos'
  | 'healthyRefreshers'
  | 'pasta'
  | 'maggi'
  | 'fries'
  | 'smoothies'
  | 'shakes'
  | 'wraps'
  | 'springRolls'
  | 'appetizers'
  | 'soups'
  | 'gravy'
  | 'mainCourse'
  | 'indianCombos'
  | 'riceNoodles'
  | 'thali'
  | 'hotBeverages'
  | 'iceCream'

function getItemImage(category: string): string {
  const categoryImages: Record<string, string> = {
    pizza: images.pizza,
    bestSellersCombos: images.combos,
    burgers: images.burgers,
    sandwiches: images.sandwiches,
    healthySandwiches: images.sandwiches,
    momos: images.momos,
    mojitos: images.drinks,
    healthyRefreshers: images.smoothies,
    pasta: images.pasta,
    maggi: images.rice,
    fries: images.fries,
    smoothies: images.smoothies,
    shakes: images.dessert,
    wraps: images.wraps,
    springRolls: images.momos,
    appetizers: images.starters,
    soups: images.soups,
    gravy: images.main,
    mainCourse: images.thali,
    indianCombos: images.combos,
    riceNoodles: images.rice,
    thali: images.thali,
    hotBeverages: images.tea,
    iceCream: images.dessert,
  }
  return categoryImages[category] ?? images.combos
}

function item(
  id: string,
  name: string,
  price: string,
  category: MenuCategoryKey,
  quantity = '1 portion',
  description?: string
): MenuItem {
  return {
    id,
    name,
    quantity,
    price: `₹${price}`,
    category,
    description,
    image: getItemImage(category),
  }
}

export interface MenuCategoryConfig {
  name: string
  shortDescription: string
  icon: string
  image: string
  items: MenuItem[]
}

const images = {
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&h=760&q=85',
  combos: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&h=760&q=85',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&h=760&q=85',
  sandwiches: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&h=760&q=85',
  momos: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&h=760&q=85',
  drinks: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&h=760&q=85',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&h=760&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&h=760&q=85',
  smoothies: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&h=760&q=85',
  wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&h=760&q=85',
  starters: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&h=760&q=85',
  soups: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&h=760&q=85',
  main: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&h=760&q=85',
  rice: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&h=760&q=85',
  thali: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&h=760&q=85',
  tea: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&h=760&q=85',
  dessert: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&h=760&q=85',
}

export const menuCategories: Record<MenuCategoryKey, MenuCategoryConfig> = {
  pizza: {
    name: 'Fresh Dough Pizza', shortDescription: 'Small, medium and large fresh dough pizzas.', icon: '🍕', image: images.pizza,
    items: [
      item('pz-small', 'Small Pizza (Any 6 inch)', '140', 'pizza', '6 inch'),
      item('pz-cheese-m', 'Plain Cheese Pizza', '220', 'pizza', 'Medium'),
      item('pz-cheese-l', 'Plain Cheese Pizza', '310', 'pizza', 'Large'),
      ...[
        ['capsicum-onion', 'Capsicum Onion Pizza'], ['mexican', 'Mexican Pizza'],
        ['mushroom-capsicum-onion', 'Mushroom Capsicum Onion Pizza'], ['barbeque-mushroom', 'Barbeque Mushroom Pizza'],
        ['mango-special', 'Mango Special Pizza'], ['italian', 'Italian Pizza'],
        ['veg-schezwan', 'Veg Schezwan Pizza'], ['paneer-makhni', 'Paneer Makhni Pizza'],
        ['exotic-vegetable', 'Exotic Vegetable Pizza'], ['pineapple-corn', 'Pineapple Corn Pizza'],
        ['paneer-manchurian', 'Paneer Manchurian Pizza'], ['paneer-makhani', 'Paneer Makhani Pizza'],
        ['paneer-tikka', 'Paneer Tikka Pizza'], ['special-corn', 'Special Corn Pizza'],
      ].flatMap(([slug, name]) => [
        item(`pz-${slug}-m`, name, '260', 'pizza', 'Medium'),
        item(`pz-${slug}-l`, name, '380', 'pizza', 'Large'),
      ]),
    ],
  },
  bestSellersCombos: {
    name: "Best Sellers Combo's", shortDescription: 'Popular value combos from the printed menu.', icon: '⭐', image: images.combos,
    items: [
      item('bc-1', 'Multigrain Bread Grilled Sandwich + Lemon Mojito', '199', 'bestSellersCombos', '1 combo', 'Broccoli, mushroom and corn'),
      item('bc-2', 'Chef Special Pizza + Cold Drink', '299', 'bestSellersCombos', '1 combo', 'Baby corn / paneer / broccoli / mushroom'),
      item('bc-3', 'Crispy Paneer Burger + Fries + Cold Drink', '160', 'bestSellersCombos', '1 combo'),
      item('bc-4', 'Pasta with Garlic Bread (Red / White / Mixed)', '210', 'bestSellersCombos', '1 combo'),
      item('bc-5', 'Afghani Momos Pure Paneer (8 pcs) + Cold Drink', '230', 'bestSellersCombos', '1 combo'),
      item('bc-6', 'Veg Steam Momos + Cold Drink', '150', 'bestSellersCombos', '1 combo'),
      item('bc-7', 'Loaded Fries + Cold Drink', '180', 'bestSellersCombos', '1 combo'),
      item('bc-8', 'Honey Chilli Potato + Cold Drink', '190', 'bestSellersCombos', '1 combo'),
      item('bc-9', 'Veg Fried Rice / Noodles with Veg Manchurian', '329', 'bestSellersCombos', '1 combo'),
      item('bc-10', 'Chilli Paneer with Noodles / Fried Rice', '329', 'bestSellersCombos', '1 combo'),
    ],
  },
  burgers: {
    name: 'Burgers', shortDescription: 'Classic, paneer and special burgers.', icon: '🍔', image: images.burgers,
    items: [
      item('bg-1', 'Classic Veg Burger', '89', 'burgers'), item('bg-2', 'Veg Burger with Fries', '109', 'burgers'),
      item('bg-3', 'Crispy Paneer Burger with Fries', '119', 'burgers'), item('bg-4', 'Multigrain Burger with Fries', '109', 'burgers'),
      item('bg-5', 'Double Decker Burger with Fries', '119', 'burgers'),
      item('bg-6', 'Maharaja Tandoori Paneer + Special Tikki Burger', '129', 'burgers'),
      item('bg-7', 'Mango Special Burger Combo', '149', 'burgers', 'Burger + Coke + Fries'),
    ],
  },
  sandwiches: {
    name: 'Sandwiches', shortDescription: 'Grilled, cold and paneer sandwiches.', icon: '🥪', image: images.sandwiches,
    items: [
      item('sw-1', 'Mushroom & Cheese Sandwich', '109', 'sandwiches'), item('sw-2', 'Club Sandwich (Cold Sandwich)', '109', 'sandwiches'),
      item('sw-3', 'Paneer Manchurian Sandwich', '99', 'sandwiches'), item('sw-4', 'Paneer Tikka Sandwich', '99', 'sandwiches'),
      item('sw-5', 'Special Tikki Sandwich', '99', 'sandwiches'), item('sw-6', 'Veg Corn Grilled Sandwich', '79', 'sandwiches'),
      item('sw-7', 'Italian Grilled Sandwich', '79', 'sandwiches'),
    ],
  },
  healthySandwiches: {
    name: 'Healthy Sandwiches', shortDescription: 'Multigrain and brown bread choices.', icon: '🌾', image: images.sandwiches,
    items: [
      item('hs-1', 'Multigrain Bread Sandwich', '109', 'healthySandwiches', '1 portion', 'Broccoli, mushroom, tomato, iceberg, corn & more'),
      item('hs-2', 'Peanut Butter Sandwich', '119', 'healthySandwiches', '1 portion', 'Broccoli, mushroom, iceberg, corn & more'),
      item('hs-3', 'Brown Bread Sandwich', '99', 'healthySandwiches', 'Customise your sandwich'),
      item('hs-4', 'Multigrain Sub', '169', 'healthySandwiches'), item('hs-5', 'Multigrain Sub with Paneer / Soya', '179', 'healthySandwiches'),
      item('hs-extra-cheese', 'Extra Cheese Slice', '30', 'healthySandwiches', 'Add-on'),
    ],
  },
  momos: {
    name: 'Momos', shortDescription: 'Steam, fried, pan fried, kurkure, platter and Afghani momos.', icon: '🥟', image: images.momos,
    items: [
      ...[
        ['veg-classic-steam', 'Veg Classic Momos - Steam', '80', '110'], ['chilli-paneer-steam', 'Chilli Paneer Momos - Steam', '90', '150'],
        ['pure-paneer-steam', 'Pure Paneer Momos - Steam', '100', '160'], ['veg-classic-fried', 'Veg Classic Momos - Fried', '80', '120'],
        ['chilli-paneer-fried', 'Chilli Paneer Momos - Fried', '100', '150'], ['pure-paneer-fried', 'Pure Paneer Momos - Fried', '100', '160'],
        ['veg-classic-pan', 'Veg Classic Momos - Pan Fried', '80', '140'], ['chilli-paneer-pan', 'Chilli Paneer Momos - Pan Fried', '100', '160'],
        ['pure-paneer-pan', 'Pure Paneer Momos - Pan Fried', '100', '170'], ['veg-classic-kurkure', 'Veg Classic Kurkure Momos', '110', '210'],
        ['chilli-paneer-kurkure', 'Chilli Paneer Kurkure Momos', '110', '210'], ['pure-paneer-kurkure', 'Pure Paneer Kurkure Momos', '110', '210'],
        ['veg-classic-afghani', 'Veg Classic Afghani Momos', '110', '210'], ['chilli-paneer-afghani', 'Chilli Paneer Afghani Momos', '110', '210'],
        ['pure-paneer-afghani', 'Pure Paneer Afghani Momos', '110', '210'],
      ].flatMap(([slug, name, half, full]) => [item(`mo-${slug}-h`, name, half, 'momos', 'Half'), item(`mo-${slug}-f`, name, full, 'momos', 'Full')]),
      item('mo-platter-veg', 'Veg Classic Momo Platter', '240', 'momos', '9 pcs', 'Steam + fried + pan fried'),
      item('mo-platter-chilli', 'Chilli Paneer Momo Platter', '250', 'momos', '9 pcs', 'Steam + fried + pan fried'),
      item('mo-platter-paneer', 'Pure Paneer Momo Platter', '250', 'momos', '9 pcs', 'Steam + fried + pan fried'),
    ],
  },
  mojitos: {
    name: 'Mojitos', shortDescription: 'All mojitos and iced teas at ₹109.', icon: '🍹', image: images.drinks,
    items: ['Lemon Ice Tea', 'Peach Ice Tea', 'Kiwi Mojito', 'Black Currant Mojito', 'Mix Berries Mojito', 'Strawberry Mojito', 'Blue Lagoon Mojito', 'Lemon Mojito', 'Green Apple Mojito', 'Litchi Mojito', 'Paan Mojito', 'Mulberry Mojito'].map((name, i) => item(`mj-${i + 1}`, name, '109', 'mojitos')),
  },
  healthyRefreshers: {
    name: 'Healthy Refreshers', shortDescription: 'Fresh lime and Rooh Afza refreshers.', icon: '🥤', image: images.drinks,
    items: [item('hr-1', 'Fresh Lime Soda / Water', '89', 'healthyRefreshers'), item('hr-2', 'Rooh Afza with Fresh Lemon', '89', 'healthyRefreshers')],
  },
  pasta: {
    name: 'Penne Pasta', shortDescription: 'Red, white, mixed and baked pasta.', icon: '🍝', image: images.pasta,
    items: [item('pa-1', 'Pasta White / Red / Mixed', '169', 'pasta'), item('pa-2', 'Baked Pasta', '209', 'pasta'), item('pa-3', 'Pasta with Garlic Bread Combo', '209', 'pasta'), item('pa-4', 'Garlic Bread', '109', 'pasta', '3 pcs')],
  },
  maggi: {
    name: 'Maggi', shortDescription: 'Vegetable, paneer, baked and cheese Maggi.', icon: '🍜', image: images.pasta,
    items: [item('mg-1', 'Vegetable Maggi', '69', 'maggi'), item('mg-2', 'Schezwan Teekhi Maggi', '79', 'maggi'), item('mg-3', 'Paneer Maggi', '79', 'maggi'), item('mg-4', 'Baked Maggi', '99', 'maggi'), item('mg-5', 'Tadka Corn & Paneer Maggi', '99', 'maggi'), item('mg-6', 'Cheese Maggi', '79', 'maggi')],
  },
  fries: {
    name: 'Belgium Fries', shortDescription: 'Classic, peri peri and loaded fries.', icon: '🍟', image: images.fries,
    items: [item('fr-1', 'Finger Chips', '109', 'fries'), item('fr-2', 'Fries Peri Peri', '129', 'fries'), item('fr-3', 'Loaded Fries with Cheese', '149', 'fries')],
  },
  smoothies: {
    name: 'Healthy Smoothies', shortDescription: 'Weight-loss smoothies; selected options served with honey.', icon: '🥛', image: images.smoothies,
    items: [item('sm-1', 'Date Smoothie with Oats', '149', 'smoothies', '1 glass', 'Served with honey'), item('sm-2', 'Banana, Dates & Oats Smoothie', '149', 'smoothies', '1 glass', 'Served with honey'), item('sm-3', 'Date & Choco Smoothie with Almonds', '159', 'smoothies')],
  },
  shakes: {
    name: 'Shakes', shortDescription: 'Fruit, coffee, cookie and ice-cream shakes.', icon: '🥤', image: images.smoothies,
    items: [
      item('sh-1', 'Mulberry / Mix Berries Shake', '119', 'shakes'), item('sh-2', 'Cold Coffee', '109', 'shakes'),
      item('sh-3', 'Mango Shake', '109', 'shakes'), item('sh-4', 'Fresh Banana Shake', '109', 'shakes'), item('sh-5', 'Bubblegum Shake', '119', 'shakes'),
      item('sh-6', 'Vanilla / Strawberry / Butterscotch Shake', '109', 'shakes'), item('sh-7', 'Chocolate Cookie Shake', '119', 'shakes'),
      item('sh-8', 'Kit-Kat / Oreo / Kiwi Shake', '119', 'shakes'), item('sh-9', 'Cold Coffee with Ice Cream', '149', 'shakes'), item('sh-10', 'Choco Brownie Shake', '149', 'shakes'),
      item('sh-a1', 'Extra Lemon', '20', 'shakes', 'Add-on'), item('sh-a2', 'Extra Corn', '20', 'shakes', 'Add-on'),
      item('sh-a3', 'Extra Broccoli', '20', 'shakes', 'Add-on'), item('sh-a4', 'Extra Chia Seeds', '20', 'shakes', 'Add-on'),
      item('sh-a5', 'Extra Cheese', '30', 'shakes', 'Add-on'), item('sh-a6', 'Extra Dip', '20', 'shakes', 'Add-on'),
      item('sh-a7', 'Extra Mushroom', '20', 'shakes', 'Add-on'), item('sh-a8', 'Add Cold Drink', '39', 'shakes', 'Add-on'),
    ],
  },
  wraps: {
    name: 'Wraps', shortDescription: 'Chaap, mushroom, corn and paneer wraps.', icon: '🌯', image: images.wraps,
    items: [item('wr-1', 'Masala Chaap Wrap', '130', 'wraps'), item('wr-2', 'Mushroom Wrap', '130', 'wraps'), item('wr-3', 'Veg Corn Wrap', '120', 'wraps'), item('wr-4', 'Paneer Tikka Wrap', '130', 'wraps'), item('wr-5', 'Paneer Manchurian Wrap', '130', 'wraps'), item('wr-6', 'Vegetable Cheese Wrap', '130', 'wraps')],
  },
  springRolls: {
    name: 'Spring Rolls', shortDescription: 'Plain and kurkure spring rolls.', icon: '🥢', image: images.starters,
    items: [item('sr-veg-p', 'Vegetables Spring Rolls', '149', 'springRolls', 'Plain'), item('sr-veg-k', 'Vegetables Spring Rolls', '159', 'springRolls', 'Kurkure'), item('sr-paneer-p', 'Paneer Corn Spring Rolls', '159', 'springRolls', 'Plain'), item('sr-paneer-k', 'Paneer Corn Spring Rolls', '169', 'springRolls', 'Kurkure')],
  },
  appetizers: {
    name: 'Appetizers / Snacks', shortDescription: 'Chinese snacks, corn, paneer, soya and chaap.', icon: '🥡', image: images.starters,
    items: [
      item('ap-1', 'Masala Sweet Corn', '79', 'appetizers'), item('ap-2', 'Crispy Corn', '159', 'appetizers'),
      ...[
        ['veg-manchurian', 'Veg Manchurian Dry', '199', '229'], ['chilli-paneer', 'Chilli Paneer Dry', '199', '229'],
        ['chilli-mushroom', 'Chilli Mushroom', '199', '229'], ['chilli-soya', 'Chilli Soya', '139', '199'],
        ['kurkure-soya', 'Kurkure Soya Nuggets', '139', '199'], ['paneer-manchurian', 'Paneer Manchurian Dry', '199', '229'],
      ].flatMap(([slug, name, half, full]) => [item(`ap-${slug}-h`, name, half, 'appetizers', 'Half'), item(`ap-${slug}-f`, name, full, 'appetizers', 'Full')]),
      item('ap-3', 'Kurkure Paneer Fingers', '179', 'appetizers'), item('ap-4', 'Loaded Cheesy Nachos', '199', 'appetizers'),
      item('ap-5', 'Honey Chilli Potato', '169', 'appetizers'), item('ap-6', 'Chilli Potato', '169', 'appetizers'), item('ap-7', 'Veg Masala Chaap', '139', 'appetizers'),
    ],
  },
  soups: {
    name: 'Soups', shortDescription: 'Vegetarian soups.', icon: '🥣', image: images.soups,
    items: [item('sp-1', 'Veg Corn Soup', '109', 'soups'), item('sp-2', 'Manchow Soup', '109', 'soups'), item('sp-3', "Hot 'n' Sour Soup", '109', 'soups'), item('sp-4', 'Exotic Vegetables Healthy Soup', '109', 'soups'), item('sp-5', 'Lemon Coriander Soup', '109', 'soups')],
  },
  gravy: {
    name: 'Gravy', shortDescription: 'Vegetable and paneer gravy dishes.', icon: '🥘', image: images.main,
    items: [
      ...[
        ['hot-garlic', 'Vegetables in Hot Garlic Sauce'], ['mushroom-oyster', 'Vegetables in Mushroom & Oyster Sauce'],
        ['manchurian', 'Vegetables Manchurian Gravy'], ['chilli-paneer', 'Chilli Paneer Gravy'],
      ].flatMap(([slug, name]) => [item(`gv-${slug}-h`, name, '230', 'gravy', 'Half'), item(`gv-${slug}-f`, name, '280', 'gravy', 'Full')]),
      item('gv-rogan-josh', 'Veg Rogan Josh with Punjabi Kulcha', '199', 'gravy'),
    ],
  },
  mainCourse: {
    name: 'Main Course', shortDescription: 'Rajma, paneer, chana, chaap, rice and raita.', icon: '🍛', image: images.main,
    items: [item('mc-1', 'Jammu Ke Rajma', '149', 'mainCourse'), item('mc-2', 'Kashmiri Palak Paneer', '179', 'mainCourse'), item('mc-3', 'Palak Corn', '179', 'mainCourse'), item('mc-4', 'Kabuli Chana', '149', 'mainCourse'), item('mc-5', 'Vegetarian Masala Chaap', '139', 'mainCourse'), item('mc-6', 'Rice Plate', '119', 'mainCourse'), item('mc-7', 'Vegetarian Pulao', '129', 'mainCourse'), item('mc-8', 'Mixed Raita', '69', 'mainCourse')],
  },
  indianCombos: {
    name: 'Special Indian Combo', shortDescription: 'Half and full Indian meal combos.', icon: '🍱', image: images.combos,
    items: [
      ...[
        ['rajma-rice', 'Rajma + Rice', '90', '119'], ['rajma-kulcha', 'Rajma Dip Kulcha', '90', '119'],
        ['chana-kulcha', 'Chana Dip Kulcha', '90', '119'], ['chana-rice', 'Kabuli Chana + Rice', '90', '119'],
        ['palak-paneer', 'Palak Paneer + Veg Pulao', '119', '149'], ['palak-corn', 'Palak Corn + Veg Pulao', '119', '149'],
        ['curry-pakora', 'Tuesday Special Curry Pakora + Rice', '109', '139'], ['chaap-rice', 'Veg Special Chaap + Rice', '119', '149'],
        ['chaap-kulcha', 'Veg Chaap + Kulcha', '119', '149'],
      ].flatMap(([slug, name, half, full]) => [item(`ic-${slug}-h`, name, half, 'indianCombos', 'Half'), item(`ic-${slug}-f`, name, full, 'indianCombos', 'Full')]),
      item('ic-dahi', 'Dahi Bhalla', '69', 'indianCombos'), item('ic-lassi', 'Lassi Sweet / Salty', '69', 'indianCombos'),
      item('ic-ghee', 'Desi Ghee', '25', 'indianCombos', 'Add-on'), item('ic-paneer', 'Paneer', '25', 'indianCombos', 'Add-on'),
    ],
  },
  riceNoodles: {
    name: 'Rice / Noodles', shortDescription: 'Fried rice and noodles.', icon: '🍜', image: images.rice,
    items: [item('rn-1', 'Veg Fried Rice', '159', 'riceNoodles'), item('rn-2', 'Golden Corn & Paneer Fried Rice', '179', 'riceNoodles'), item('rn-3', 'Exotic Vegetable Fried Rice', '199', 'riceNoodles'), item('rn-4', 'Veg Special Noodles', '159', 'riceNoodles'), item('rn-5', 'Chilli Garlic Noodles', '159', 'riceNoodles'), item('rn-6', 'Schezwan Noodles', '169', 'riceNoodles'), item('rn-7', 'Vegetable Paneer Noodles', '189', 'riceNoodles'), item('rn-8', 'Exotic Vegetable Noodles', '189', 'riceNoodles')],
  },
  thali: {
    name: 'Thali', shortDescription: 'Complete vegetarian thalis.', icon: '🍽️', image: images.thali,
    items: [item('th-1', 'Thali with Raita + Sweet Dish + 2 Tawa Roti + 2 Vegetable Dishes + Paneer Dish + Veg Pulao', '219', 'thali'), item('th-2', 'Thali with Raita + 2 Tawa Roti + 2 Dishes + 1 Paneer + Rice', '189', 'thali')],
  },
  hotBeverages: {
    name: 'Hot Beverages', shortDescription: 'Coffee, tea and winter special qawah.', icon: '☕', image: images.tea,
    items: [item('hb-1', 'Coffee', '40', 'hotBeverages'), item('hb-2', 'Tea', '30', 'hotBeverages'), item('hb-3', 'Organic Tea', '40', 'hotBeverages'), item('hb-4', 'Lemon Tea', '40', 'hotBeverages'), item('hb-5', 'Shashi Qawah (Winter Special)', '60', 'hotBeverages')],
  },
  iceCream: {
    name: 'Ice Cream', shortDescription: 'Ice cream, fudge, fruit cocktail and brownie.', icon: '🍦', image: images.dessert,
    items: [item('icr-1', 'Ice Cream', '99', 'iceCream', 'Real strawberry / pineapple / mix berries'), item('icr-2', 'Hot Chocolate Fudge', '139', 'iceCream'), item('icr-3', 'Fruit Cocktail', '149', 'iceCream'), item('icr-4', 'Choco Brownie with Ice Cream', '129', 'iceCream')],
  },
}

export function generateWhatsAppOrderMessage(menuItem: MenuItem): string {
  return `Hi Mango, I would like to order:\n\n${menuItem.name}\n${menuItem.quantity} - ${menuItem.price}\n\nPlease confirm availability. Thank you!`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], totalPrice: number): string {
  const itemsList = cartItems.map((cartItem) => {
    const unitPrice = Number.parseFloat(cartItem.price.replace('₹', '').replace(',', ''))
    return `• ${cartItem.name}\n  ${cartItem.quantity} × ${cartItem.cartQuantity} = ₹${((Number.isNaN(unitPrice) ? 0 : unitPrice) * cartItem.cartQuantity).toFixed(0)}`
  }).join('\n\n')
  const totalItemsCount = cartItems.reduce((sum, cartItem) => sum + cartItem.cartQuantity, 0)
  return `Hi Mango, I would like to place an order:\n\n${itemsList}\n\n━━━━━━━━━━━━━━━━━━━━\nTotal items: ${totalItemsCount}\nEstimated total: ₹${totalPrice.toFixed(0)}\n━━━━━━━━━━━━━━━━━━━━\n\nPlease confirm availability and final price. Thank you!`
}

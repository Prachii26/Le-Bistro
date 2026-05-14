import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'item-01', name: 'Garden Fresh Bowl',      price: 14.50, category: 'main',    emoji: '🥗', tags: ['Popular', 'Vegan'],        calories: 420, allergens: [],                       description: 'Quinoa, avocado, cherry tomatoes, lemon tahini dressing' },
  { id: 'item-02', name: 'Lemon Herb Salmon',       price: 22.00, category: 'main',    emoji: '🍋', tags: ["Chef's Pick"],              calories: 580, allergens: ['fish'],                description: 'Pan-seared fillet, capers, dill cream sauce, seasonal greens' },
  { id: 'item-03', name: 'Truffle Arancini',        price: 12.00, category: 'starter', emoji: '🍄', tags: ['Popular'],                  calories: 310, allergens: ['gluten', 'dairy'],    description: 'Crispy risotto balls, black truffle oil, aged parmesan' },
  { id: 'item-04', name: 'Sparkling Water',         price: 4.50,  category: 'drink',   emoji: '💧', tags: [],                           calories: 0,   allergens: [],                       description: 'San Pellegrino, 750ml, served chilled' },
  { id: 'item-05', name: 'Mango Sorbet',            price: 8.00,  category: 'dessert', emoji: '🥭', tags: ['Vegan', 'New'],             calories: 180, allergens: [],                       description: 'House-made, Alphonso mango, lime zest, fresh mint' },
  { id: 'item-06', name: 'Grilled Chicken Caesar',  price: 18.50, category: 'main',    emoji: '🫙', tags: ['Popular'],                  calories: 520, allergens: ['gluten', 'dairy', 'egg'], description: 'Free-range chicken, romaine, parmesan, house croutons' },
  { id: 'item-07', name: 'Burrata & Tomato',        price: 13.00, category: 'starter', emoji: '🍅', tags: ["Chef's Pick"],              calories: 290, allergens: ['dairy'],               description: 'Fresh burrata, heirloom tomatoes, aged balsamic, basil oil' },
  { id: 'item-08', name: 'Hibiscus Lemonade',       price: 6.50,  category: 'drink',   emoji: '🌺', tags: ['New', 'Vegan'],             calories: 90,  allergens: [],                       description: 'House hibiscus syrup, fresh lemon, sparkling water' },
  { id: 'item-09', name: 'Wagyu Beef Burger',       price: 26.00, category: 'main',    emoji: '🍔', tags: ['Popular'],                  calories: 780, allergens: ['gluten', 'dairy', 'egg'], description: 'Wagyu patty, aged cheddar, truffle aioli, brioche bun' },
  { id: 'item-10', name: 'Pistachio Crème Brûlée', price: 10.00, category: 'dessert', emoji: '🍮', tags: ["Chef's Pick"],              calories: 340, allergens: ['dairy', 'egg'],        description: 'Classic vanilla custard, pistachio praline, caramelised crust' },
  { id: 'item-11', name: 'Sourdough & Butter',      price: 5.00,  category: 'starter', emoji: '🍞', tags: [],                           calories: 210, allergens: ['gluten', 'dairy'],    description: 'House-baked sourdough, cultured butter, Maldon sea salt' },
  { id: 'item-12', name: 'Cold Brew Coffee',        price: 5.50,  category: 'drink',   emoji: '☕', tags: ['Popular'],                  calories: 15,  allergens: [],                       description: '18-hour cold steeped, served over ice, oat milk on side' },
];

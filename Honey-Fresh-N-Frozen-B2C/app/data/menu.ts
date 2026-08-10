// Compatibility entrypoint. The restaurant menu has one canonical data source.
export {
  menuCategories,
  generateWhatsAppOrderMessage,
  generateWhatsAppCartMessage,
} from '../shops/honeys-fresh-n-frozen/menu'

export type {
  MenuItem,
  CartItem,
  MenuCategoryKey,
  MenuCategoryConfig,
} from '../shops/honeys-fresh-n-frozen/menu'

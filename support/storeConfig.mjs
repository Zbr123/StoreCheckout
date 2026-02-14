/** Store base URL – change per environment if needed */
export const STORE_BASE_URL = process.env.STORE_BASE_URL || 'https://9975.qa-bkstr.com';

/** Product page with Small/Medium/Large variants – used by variant scenarios so they don't depend on random dashboard products */
export const VARIANT_PRODUCT_URL = process.env.VARIANT_PRODUCT_URL ||
  'https://9975.qa-bkstr.com/products/mite623-d410-share-storg-sm-36232-1?variant=46769743134977';

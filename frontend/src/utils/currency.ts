export const formatCurrency = (
  amount: number,
  locale = 'en-US',
  currency = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateTotal = (
  items: Array<{ price: number; quantity: number }>,
  taxRate = 0,
  discount = 0
): { subtotal: number; tax: number; discount: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const discountAmount = (subtotal + tax) * (discount / 100);
  const total = subtotal + tax - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)}%`;
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
};

export const calculateVAT = (amount: number, vatRate = 20): number => {
  return (amount * vatRate) / 100;
};

export const calculateDiscount = (amount: number, discountRate: number): number => {
  return (amount * discountRate) / 100;
};

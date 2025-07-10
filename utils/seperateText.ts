export function camelCaseToSeparated(value: string): string {
  const separated = value.replace(/([a-z])([A-Z])/g, "$1 $2");
  return separated.charAt(0).toUpperCase() + separated.slice(1);
}

export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    ...options
  }).format(value);
};

export const calculateTransactionFee = (amount: number) => {
  // this calculation currently only applies to Local transactions in Nigeria
  const percentageFeeRate = 0.039; // 3.9%
  const fixedFee = 100; // NGN 100
  const feeWaiverThreshold = 2500; // NGN 2500
  const feeCap = 1000000; // NGN 1,000,000
  let totalTransactionFee = amount * percentageFeeRate;
  // only apply fixedFee for amounts >= feeWaiverThreshold (2500)
  if (amount >= feeWaiverThreshold) {
    totalTransactionFee += fixedFee;
  }
  // Apply fee cap
  totalTransactionFee = Math.min(totalTransactionFee, feeCap);
  return totalTransactionFee;
};

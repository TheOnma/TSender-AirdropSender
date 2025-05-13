export function calculateTotal(amounts: string): number {
  const amountArray = amounts
    .split(/[\n,]+/) // Split by both commas and newlines
    .map(amt => amt.trim()) // Remove whitespace around numbers
    .filter(amt => amt !== '') // Remove empty strings
    .map(amt => parseFloat(amt)) // Convert to numbers

  return amountArray
    .filter(num => !isNaN(num)) // Filter out invalid numbers
    .reduce((sum, num) => sum + num, 0); // Sum all valid numbers

    
}
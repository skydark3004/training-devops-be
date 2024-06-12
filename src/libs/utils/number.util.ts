export const inRangeWithEqual = (value: number, min: number, max: number) => value >= min && value <= max;

export const inRangeWithoutEqual = (value: number, min: number, max: number) => value > min && value < max;

export const isInteger = (value: number): boolean => value.toString().indexOf('.') == -1;
export const isFloat = (value: number): boolean => value.toString().indexOf('.') !== -1;

export const getFloat = (value: number): number => {
  if (!isFloat(value)) {
    return 0;
  }
  const decimals = value - Math.floor(value);
  return Number(decimals.toFixed(2));
};

export const roundNumberWithRadix = (numberInput: number, radix = 1) => Number(numberInput.toFixed(radix));

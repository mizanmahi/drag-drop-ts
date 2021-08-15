// ? validation logic
interface validatable {
  value: string | number;
  required?: boolean;
  maxLen?: number;
  minLen?: number;
  max?: number;
  min?: number;
}

export const validate = (validating: validatable) => {
  let validated = true;

  let { value, required, maxLen, minLen, max, min } = validating;

  if (required) {
    validated = validated && value.toString().length !== 0;
  }
  if (maxLen != null && typeof value === 'string') {
    validated = validated && value.length <= maxLen;
  }
  if (minLen != null && typeof value === 'string') {
    validated = validated && value.length >= minLen;
  }
  if (max != null && typeof value === 'number') {
    validated = validated && value <= max;
  }
  if (min != null && typeof value === 'number') {
    validated = validated && value >= min;
  }

  return validated;
};

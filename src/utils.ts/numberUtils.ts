/**
 * Constrains a number between a minimum and maximum value
 */
export function constrain(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

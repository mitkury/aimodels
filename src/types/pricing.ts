export interface TokenBasedPricePerMillionTokens {
  /** Price per million input tokens */
  input: number;
  /** Price per million output tokens */
  output: number;
  /** Price type */
  type: 'token';
}

export interface ImagePrice {
  /** Price per image */
  price: number;
  /** Image size */
  size: string;
  /** Price type */
  type: 'image';
  /** Price unit */
  unit: 'per_image';
}

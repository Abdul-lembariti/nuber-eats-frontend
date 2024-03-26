/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RestaurantPart
// ====================================================

export interface RestaurantPart_category {
  __typename: "Category";
  name: string;
}

export interface RestaurantPart {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  isPromoted: boolean;
  category: RestaurantPart_category | null;
}

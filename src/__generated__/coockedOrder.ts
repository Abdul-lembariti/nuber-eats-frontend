/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: coockedOrder
// ====================================================

export interface coockedOrder_coockedOrder_driver {
  __typename: "User";
  email: string;
}

export interface coockedOrder_coockedOrder_customer {
  __typename: "User";
  email: string;
}

export interface coockedOrder_coockedOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface coockedOrder_coockedOrder {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: coockedOrder_coockedOrder_driver | null;
  customer: coockedOrder_coockedOrder_customer | null;
  restaurant: coockedOrder_coockedOrder_restaurant | null;
}

export interface coockedOrder {
  coockedOrder: coockedOrder_coockedOrder;
}

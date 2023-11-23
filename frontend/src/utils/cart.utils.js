export const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

export const updateCart = (state) => {
  //   cart price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //   shipping price = cart price > 100 ? free : 10
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  //   15% of cart price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

  //   total price
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  );

  localStorage.setItem("cart", JSON.stringify(state));
  return state
};

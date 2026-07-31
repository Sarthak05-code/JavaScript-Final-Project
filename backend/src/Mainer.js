function calculateTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  console.log("total:", total);

  return total;
}

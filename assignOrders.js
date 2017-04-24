'use strict';

const todaysOrders = require('./orders.json');
const chefs = require('./chefs.json');
const totals = chefs.reduce((totals, chef) => {
  const { minOrders, maxOrders } = chef;

  totals.min += minOrders;
  totals.max += maxOrders;

  return totals;
}, {min: 0, max: 0});

function assignOrders(orders) {
  if (totals.min > orders.length) {
    throw 'Not enough orders to meet minimums.';
  }
  if (totals.max < orders.length) {
    throw "Orders exceed chef capacity.";
  }

// First assign orders to meet all chef minimums

  let assignedIdx = 0;

  for (const chef of chefs) {
    chef.orders = orders.slice(assignedIdx, chef.minOrders + assignedIdx);
    assignedIdx += chef.minOrders;
  }

// Divide remaining orders between chefs

  const remainingOrders = orders.slice(assignedIdx);
  let chefIdx = 0;

  chefs.sort((a, b) => {
    return a.orders.length - b.orders.length;
  })
  while(remainingOrders.length > 0) {
    if (chefs[chefIdx].orders.length < chefs[chefIdx].maxOrders) {
      chefs[chefIdx].orders.push(remainingOrders.pop());
    } else {
      chefIdx++;
    }

    const nextChef = chefs[chefIdx + 1] || chefs[0];

    if (chefs[chefIdx].orders.length >= nextChef.orders.length) {
      chefIdx++;
    }
    if (chefIdx >= chefs.length) {
      chefIdx = 0;
    }
  }
  console.log(chefs);
  return chefs;
};

assignOrders(todaysOrders);

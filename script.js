let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const currencyUnit = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("price-display").textContent = `$${price.toFixed(2)}`;
  updateDrawerDisplay();
});

function updateDrawerDisplay() {
  const drawerDisplay = document.getElementById("drawer-display");
  let drawerContent = "";

  cid.forEach((currency) => {
    drawerContent += `<div>${currency[0]}: $${currency[1].toFixed(2)}</div>`;
  });

  drawerDisplay.innerHTML = drawerContent;
}

document.getElementById("purchase-btn").addEventListener("click", function () {
  const cashInput = document.getElementById("cash");
  const cash = parseFloat(cashInput.value);
  const changeDueElement = document.getElementById("change-due");

  if (isNaN(cash)) {
    alert("Please enter a valid amount");
    return;
  }

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cash === price) {
    changeDueElement.textContent =
      "No change due - customer paid with exact cash";
    return;
  }

  const changeResult = checkCashRegister(price, cash, cid);
  changeDueElement.textContent = formatChangeOutput(changeResult);
});

function checkCashRegister(price, cash, cid) {
  let changeDue = Math.round((cash - price) * 100) / 100;

  const totalCid = parseFloat(
    cid.reduce((sum, currency) => sum + currency[1], 0).toFixed(2)
  );

  let register = JSON.parse(JSON.stringify(cid));

  let change = [];
  register.reverse();

  let totalChange = 0;

  for (let elem of register) {
    const currency = elem[0];
    const currencyTotal = elem[1];
    const unitValue = currencyUnit[currency];
    let currencyAmount = 0;

    while (changeDue >= unitValue && currencyTotal > currencyAmount) {
      changeDue = Math.round((changeDue - unitValue) * 100) / 100;
      currencyAmount += unitValue;
      totalChange += unitValue;
    }

    if (currencyAmount > 0) {
      change.push([currency, currencyAmount]);
    }
  }

  if (changeDue > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  totalChange = parseFloat(totalChange.toFixed(2));

  if (totalChange === totalCid) {
    return { status: "CLOSED", change: cid.filter((item) => item[1] > 0) };
  }

  return { status: "OPEN", change: change };
}

function formatChangeOutput(result) {
  if (result.status === "INSUFFICIENT_FUNDS") {
    return "Status: INSUFFICIENT_FUNDS";
  }

  if (result.status === "CLOSED") {
    return (
      "Status: CLOSED " +
      result.change.map((item) => `${item[0]}: $${item[1]}`).join(" ")
    );
  }

  return (
    "Status: OPEN " +
    result.change.map((item) => `${item[0]}: $${item[1]}`).join(" ")
  );
}

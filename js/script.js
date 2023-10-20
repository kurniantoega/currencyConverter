const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (currencyCode in country_code) {
    // selecting USD by default as FROM currency and IDR as TO currency
    let selected;
    if (i == 0) {
      selected = currencyCode == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currencyCode == "IDR" ? "selected" : "";
    }

    // creating option tag with passing currency code as a text and value
    let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;

    // inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  dropList[i].addEventListener("change", function (e) {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (code in country_code) {
    // if currency code of country list is equal to option value
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}

window.addEventListener("load", function () {
  getExchangeRate();
});

getButton.addEventListener("click", function (event) {
  event.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", function () {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  let amountVal = amount.value;
  const exchangeRateText = document.querySelector(".exchange-rate");

  // default amount if user dont enter any value or enter 0
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeRateText.innerText = "Getting exchange rate...";

  const apiKey = "5dda704c11b1f43a6b84989a";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);

      exchangeRateText.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => (exchangeRateText.innerText = "Something went wrong"));
}

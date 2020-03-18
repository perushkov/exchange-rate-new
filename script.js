const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');
const currency_input = document.getElementById('currency_input');

let avaliable_rates = [];

const calculate = () => {
  const currency_one = currencyEl_one.value;
  const currency_two = currencyEl_two.value;
  /** Welcome message on dynamic input component */
  currency_input.placeholder = `1 ${currency_one.toUpperCase()} to ${currency_two.toUpperCase()}`;

  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then(res => res.json())
    .then(data => {
      
      avaliable_rates = Object.keys(data.rates);

      const rate = data.rates[currency_two];

      rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    });
}

const showError = () => {
  alert('Unknown format of input, please check it');
  currency_input.placeholder = `1 ${currency_one} to ${currency_two}`;
}

const parseInput = text => {
  /* number CUR1 to CUR2 */
  const params = text.split(' ').filter(Boolean);
  if (params.length === 4 
      && !isNaN(parseFloat(params[0]))) {
    const currencyObject = {
      value: parseFloat(params[0]),
      currency_one: params[1].toUpperCase(),
      currency_two: params[3].toUpperCase(),
    }
    return currencyObject;
  }
  showError();
  return {
    value: currencyObject.value,
    currency_one: currencyObject.currency_one,
    currency_two: currencyObject.currency_two,
  }
}

// Event listeners
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

swap.addEventListener('click', () => {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
});

currency_input.addEventListener('change', event => {
  const currencyObject = parseInput(currency_input.value);
  if (!avaliable_rates.includes(currencyObject.currency_one)) {
    alert(`Unknown rate ${currencyObject.currency_one}`);
    return;
  }
  if (!avaliable_rates.includes(currencyObject.currency_two)) {
    alert(`Unknown rate ${currencyObject.currency_two}`);
    return;
  }
  currencyEl_one.value = currencyObject.currency_one;
  currencyEl_two.value = currencyObject.currency_two;
  amountEl_one.value = currencyObject.value;
  calculate();
});

calculate();

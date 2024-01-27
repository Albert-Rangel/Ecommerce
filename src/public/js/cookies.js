const nombreInput = document.getElementById('nombre');
const valorInput = document.getElementById('valor');

const getCookiesButton = document.getElementById('getCookies');
const setCookiesButton = document.getElementById('setCookies');

getCookiesButton.addEventListener('click', (e) => {
  fetch('https://ecommerce-production-f895.up.railway.app/getCookies')
    .then((response) => response.json())
    .then((cookies) => console.log(cookies));
});

setCookiesButton.addEventListener('click', (e) => {
  const payload = {
    nombre: nombreInput.value,
    valor: valorInput.value,
  };

  fetch('https://ecommerce-production-f895.up.railway.app/setCookies', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
});
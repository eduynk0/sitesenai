let cartCount = 0;
const cartDisplay = document.getElementById('cart-count');


const buttons = document.querySelectorAll('.add-cart');
buttons.forEach(button => {
button.addEventListener('click', (event) => {
event.preventDefault();
cartCount++;
cartDisplay.textContent = cartCount;
alert(`${button.dataset.name} foi adicionado ao carrinho!`);
});
});
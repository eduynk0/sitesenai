let cartCount = 0;
let totalPrice = 0;
let cartItems = [];

const cartDisplay = document.getElementById('cart-count');
const numero = "5541999784433";
const msg = "Estou com fome!";

const modal = document.getElementById('product-modal');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalAdd = document.getElementById('modal-add');
const quantityInput = document.getElementById('quantity');
const closeBtn = document.querySelector('.close-btn');

// === ABRIR POPUP AO CLICAR NO PRODUTO ===
document.querySelectorAll('.item img, .item p').forEach(el => {
  el.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    const name = item.dataset.name;
    const desc = item.dataset.desc;
    const price = parseFloat(item.dataset.preco);

    modalName.textContent = name;
    modalDesc.textContent = desc;
    modalPrice.textContent = `Preço: R$ ${price.toFixed(2)}`;
    quantityInput.value = 1;

    modal.style.display = 'flex';
    modalAdd.dataset.name = name;
    modalAdd.dataset.price = price;
  });
});

// === FECHAR MODAL ===
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// === ADICIONAR DIRETO AO CARRINHO ===
document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const item = document.querySelector(`.item[data-name="${name}"]`);
    const price = parseFloat(item?.dataset.preco || 0);

    cartCount++;
    totalPrice += price;

    cartDisplay.textContent = cartCount;
    cartItems.push({ name, price, quantity: 1 });

    alert(`${name} adicionado ao carrinho!`);
  });
});

// === BOTÕES DA BARRA LATERAL ===
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    const texto = button.textContent.trim().toLowerCase();

    if (texto.includes('sobre')) {
      alert('Essa é a empresa mais top do Senai.');
    } 
    else if (texto.includes('locais')) {
      alert('Local: Sesi Senai - Pinhais');
    } 
    else if (texto.includes('carrinho')) {
      if (cartItems.length === 0) {
        alert('Carrinho vazio!');
      } else {
        const lista = cartItems
          .map(item => `${item.quantity || 1}x ${item.name} (R$ ${(item.price * (item.quantity || 1)).toFixed(2)})`)
          .join('\n');
        alert(`🛒 Itens no carrinho: ${cartCount}\n\n${lista}\n\n💰 Total: R$ ${totalPrice.toFixed(2)}`);
      }
    }
  });
});

// === ADICIONAR PELO POPUP ===
modalAdd.addEventListener('click', () => {
  const name = modalAdd.dataset.name;
  const price = parseFloat(modalAdd.dataset.price);
  const quantity = parseInt(quantityInput.value);

  cartCount += quantity;
  totalPrice += price * quantity;

  cartDisplay.textContent = cartCount;

  cartItems.push({ name, price, quantity });
  alert(`${quantity}x ${name} adicionado(s) ao carrinho!`);

  modal.style.display = 'none';
});

// === BOTÃO WHATSAPP ===
const zap = document.getElementById("zap");
if (zap) {
  zap.addEventListener("click", () => {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

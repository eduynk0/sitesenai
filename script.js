let cartCount = 0;
let cartItems = []; 
const cartDisplay = document.getElementById('cart-count');
const numero = "5541999784433"
const msg = "Estou com fome!"

document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const itemName = button.dataset.name;
        cartCount++;
        cartItems.push(itemName);
        cartDisplay.textContent = cartCount;
        alert(`${itemName} foi adicionado ao carrinho!`);
    });
});

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
                // Exibe quantidade + lista de itens
                const lista = cartItems.join(', ');
                alert(`Itens no carrinho: ${cartCount}\nProdutos: ${lista}`);
            }
        }
    });
});


document.getElementById("zap").addEventListener("click", ()=>{
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank")})


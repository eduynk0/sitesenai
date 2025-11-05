document.addEventListener("DOMContentLoaded", () => {
  // ======== ESTADO GLOBAL E CONSTANTES ========
  const WHATSAPP_NUMBER = "5541999784433";
  const WHATSAPP_MSG = "Olá! Quero fazer um pedido via Senai Food.";
  const cartDisplay = document.getElementById("cart-count");
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // ======== FUNÇÕES AUXILIARES DO CARRINHO ========
  const updateCartCount = () => {
    if (!cartDisplay) return;
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartDisplay.textContent = totalItems;
  };

  const saveCart = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = (name, price, quantity) => {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ name, price, quantity });
    }
    saveCart();
  };

  const generateWhatsAppMessage = (customMessage) => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return null;
    }
    const orderList = cartItems.map(i => `${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`).join("\n");
    const total = calculateTotal().toFixed(2);
    const text = `${customMessage}\n\n*Meu pedido:*\n${orderList}\n\nTotal: R$ ${total}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  // ======== INICIALIZAÇÃO GERAL ========
  updateCartCount();

  // ======== LÓGICA DA BARRA LATERAL (COMUM A TODAS AS PÁGINAS) ========
  document.querySelector(".sidebar-nav")?.addEventListener("click", (e) => {
    const target = e.target.closest(".nav-btn");
    if (!target) return;

    const action = target.dataset.action;
    const pageMap = {
      inicio: "index.html",
      sobre: "sobre.html",
      locais: "locais.html",
      carrinho: "carrinho.html",
    };

    if (pageMap[action]) {
      window.location.href = pageMap[action];
    }
  });

  document.getElementById("zap")?.addEventListener("click", () => {
    let url;
    if (cartItems.length > 0) {
      // Se o carrinho não está vazio, gera a mensagem com o pedido
      url = generateWhatsAppMessage(WHATSAPP_MSG);
    } else {
      // Se o carrinho está vazio, gera uma mensagem de contato simples
      url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
    }
    if (url) window.open(url, "_blank");
  });

  // ======== LÓGICA DA PÁGINA DE PRODUTOS (INDEX) ========
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) {
    const modal = document.getElementById("product-modal");
    const modalName = document.getElementById("modal-name");
    const modalDesc = document.getElementById("modal-desc");
    const modalPrice = document.getElementById("modal-price");
    const modalAdd = document.getElementById("modal-add");
    const quantityInput = document.getElementById("quantity");
    const closeBtn = document.querySelector(".close-btn");

    menuContainer.addEventListener("click", (e) => {
      const itemElement = e.target.closest(".item");
      if (!itemElement) return;

      const name = itemElement.dataset.name;
      const price = parseFloat(itemElement.dataset.preco);

      // Botão "Adicionar ao carrinho" direto
      if (e.target.classList.contains("add-cart")) {
        addToCart(name, price, 1);
        alert(`${name} adicionado ao carrinho!`);
        return;
      }

      // Abrir modal ao clicar na imagem ou nome
      if (e.target.matches("img, p")) {
        modalName.textContent = name;
        modalDesc.textContent = itemElement.dataset.desc;
        modalPrice.textContent = `Preço: R$ ${price.toFixed(2)}`;
        quantityInput.value = 1;
        modalAdd.dataset.name = name;
        modalAdd.dataset.price = price;
        modal.style.display = "flex";
      }
    });

    // Eventos do Modal
    modalAdd?.addEventListener("click", () => {
      const name = modalAdd.dataset.name;
      const price = parseFloat(modalAdd.dataset.price);
      const quantity = parseInt(quantityInput.value, 10);
      addToCart(name, price, quantity);
      alert(`${quantity}x ${name} adicionado(s) ao carrinho!`);
      modal.style.display = "none";
    });

    closeBtn?.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // ======== LÓGICA DA PÁGINA DO CARRINHO ========
  const cartListContainer = document.getElementById("cart-list");
  if (cartListContainer) {
    const totalDisplay = document.getElementById("total-price");
    const finalizarBtn = document.getElementById("finalizar-compra");

    const renderCart = () => {
      cartListContainer.innerHTML = "";
      if (cartItems.length === 0) {
        cartListContainer.innerHTML = "<li>Seu carrinho está vazio.</li>";
        if (totalDisplay) totalDisplay.textContent = "R$ 0,00";
        return;
      }

      cartItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.quantity}x ${item.name}</span>
          <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-btn" data-index="${index}">Remover</button>
        `;
        cartListContainer.appendChild(li);
      });

      if (totalDisplay) totalDisplay.textContent = `R$ ${calculateTotal().toFixed(2)}`;
    };

    cartListContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const index = parseInt(e.target.dataset.index, 10);
        cartItems.splice(index, 1);
        saveCart();
        renderCart();
      }
    });

    finalizarBtn?.addEventListener("click", () => {
      const url = generateWhatsAppMessage("Olá! Quero finalizar meu pedido:");
      if (url) window.open(url, "_blank");
    });

    renderCart();
  }

  // ======== LÓGICA DA PÁGINA SOBRE (FORMULÁRIO) ========
  const cadastroForm = document.getElementById("cadastro-form");
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Impede o recarregamento da página
      
      const status = document.createElement('p');
      cadastroForm.appendChild(status);

      const data = new FormData(e.target);
      status.textContent = "Enviando...";

      try {
        const response = await fetch(e.target.action, {
          method: e.target.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.textContent = "Obrigado pelo seu cadastro! Entraremos em contato em breve.";
          cadastroForm.reset();
        } else {
          status.textContent = "Ocorreu um erro ao enviar. Tente novamente.";
        }
      } catch (error) {
        status.textContent = "Ocorreu um erro de rede. Verifique sua conexão.";
      }
    });
  }

});

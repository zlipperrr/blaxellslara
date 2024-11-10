const version = '1.2'; // Puedes usar cualquier número o cadena para cambiar la versión
const products = [
    { id: 1, name: 'Seguidores', image: `images/imagen1.jpg?v=${version}` },
    { id: 2, name: 'Likes', image: `images/imagen2.jpg?v=${version}` },
    { id: 3, name: 'Vistas', image: `images/imagen3.jpg?v=${version}` },
    { id: 4, name: 'Comentarios', image: `images/imagen4.jpg?v=${version}` },
];

const productsPerPage = 4;
let currentPage = 1;


function displayProducts(page) {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);
    
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <select>
                <option value="1000">1000 ${product.name} - $3</option>
                <option value="5000">5000 ${product.name} - $12</option>
                <option value="10000">10000 ${product.name} - $22</option>
            </select>
            <button class="addToCartBtn">Añadir al carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });

    updatePagination(page);
}

// Carrito
let cartItems = [];

// Modificar la función addToCart para mantener actualizado el pedido
async function addToCart(productName, quantity, price) {
    const product = {
        name: productName,
        quantity: quantity,
        price: price
    };
    cartItems.push(product);
    updateCartCount();

    // Si hay un código activo, actualizar el pedido en el servidor
    const activeCode = localStorage.getItem('activeOrderCode');
    if (activeCode) {
        try {
            await updateOrder(activeCode, cartItems);
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
        }
    }

    alert(`Añadido ${quantity} de ${productName} al carrito.`);
}

async function updateOrder(code, products) {
    try {
        const response = await fetch('/actualizar-pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                code: code,
                products: products
            })
        });

        if (!response.ok) {
            console.error('Error al actualizar el pedido');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Añadir evento click a los botones de "Añadir al carrito"
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("addToCartBtn")) {
        const productElement = event.target.closest('.product');
        const productName = productElement.querySelector("h2").innerText;
        const selectedOption = productElement.querySelector("select").selectedOptions[0];
        const productQuantity = selectedOption.value;
        const productPrice = selectedOption.textContent.split(" - ")[1];
        
        addToCart(productName, productQuantity, productPrice);
    }
});

// Contador del carrito
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.innerText = cartItems.length;
}

// Carrito en popup
document.getElementById('floatingCart').addEventListener('click', function() {
    const cartPopup = document.getElementById('cartPopup');
    updateCartDisplay();

    // Agregar botón de proceder al pago si no está presente
    if (!document.getElementById('checkoutBtn')) {
        const checkoutButton = document.createElement('button');
        checkoutButton.id = 'checkoutBtn';
        checkoutButton.textContent = 'Proceder al pago';
        checkoutButton.onclick = checkout;
        cartPopup.querySelector('.popup-content').appendChild(checkoutButton);
    }

    cartPopup.style.display = 'block';
});

// Consolidar la función de cerrar ventanas emergentes
function closePopup(popupId, clearCart = true) {
    document.getElementById(popupId).style.display = "none";
    // Solo limpiar el código activo cuando se cierra el popup de código inicial
    if (popupId === 'codePopup' && clearCart) {
        clearActiveOrder();
    }
    // No limpiar el código cuando se cierra el chat
    // Remover la limpieza cuando se cierra chatPopup
}

// Evento para cerrar ventanas emergentes con botón de cerrar
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        closePopup(e.target.closest('.popup').id);
    });
});

// Proceder al pago
async function checkout() {
const uniqueCode = generateUniqueCode();

  // Enviar los datos a la base de datos
try {
    const response = await fetch('/guardar-pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
            code: uniqueCode,
            products: cartItems
        })
    });

    if (response.ok) {
        // Mostrar popup con el código
        showCodePopup(uniqueCode);
    } else {
        alert('Error al procesar el pedido');
    }
} catch (error) {
    console.error('Error:', error);
}

closePopup('cartPopup');
}



// Al cargar la página, asegúrate de inicializar el contador en caso de que ya haya elementos en el carrito
document.addEventListener('DOMContentLoaded', updateCartCount);

function updatePagination(page) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    
    document.getElementById('page-info').textContent = `Página ${page}`;
    document.getElementById('prev').disabled = page === 1;
    document.getElementById('next').disabled = page === totalPages;
}

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayProducts(currentPage);
        smoothScroll();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
        currentPage++;
        displayProducts(currentPage);
        smoothScroll();
    }
});

function smoothScroll() {
    document.querySelector('#products').scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

displayProducts(currentPage);

// Mostrar la ventana emergente
function showPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
}

// Ventana emergente de inicio de sesión
document.getElementById('loginBtn').addEventListener('click', function() {
    showPopup('loginPopup');
});

// Ventana emergente de registro
document.getElementById('registerBtn').addEventListener('click', function() {
    showPopup('registerPopup');
});

// Generar código único
function generateUniqueCode() {
// Genera un código aleatorio de 10 caracteres
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let uniqueCode = '';
for (let i = 0; i < 10; i++) {
    uniqueCode += characters.charAt(Math.floor(Math.random() * characters.length));
}
return uniqueCode;
}

// Modificar la función showCodePopup
function showCodePopup(uniqueCode) {
    const codePopup = document.createElement('div');
    codePopup.classList.add('popup');
    codePopup.id = 'codePopup';
    codePopup.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closePopup('codePopup', false)">&times;</span>
            <h2>Tu Código de Pedido</h2>
            <div class="code-container">
                <span id="orderCode">${uniqueCode}</span>
                <button id="copyCodeBtn">Copiar Código</button>
            </div>
            <div class="payment-buttons">
                <button id="onlinePaymentBtn">Pago en Línea</button>
                <button id="localPaymentBtn">Pago Local</button>
            </div>
        </div>
    `;
    document.body.appendChild(codePopup);
    showPopup('codePopup');

    // Guardar el código activo en localStorage
    localStorage.setItem('activeOrderCode', uniqueCode);

    // Eventos para los botones
    document.getElementById('copyCodeBtn').addEventListener('click', function() {
        const codeText = document.getElementById('orderCode').textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            alert('Código copiado al portapapeles');
        });
    });

    document.getElementById('onlinePaymentBtn').addEventListener('click', function() {
        closePopup('codePopup', false); // No limpiar el carrito al cerrar
        showPaymentPopup();
    });

    document.getElementById('localPaymentBtn').addEventListener('click', function() {
        closePopup('codePopup', false); // No limpiar el carrito al cerrar
        showLocalPaymentPopup();
    });
}

// ...existing code...

function showLocalPaymentPopup() {
    const localPaymentPopup = document.createElement('div');
    localPaymentPopup.classList.add('popup');
    localPaymentPopup.id = 'localPaymentPopup';
    localPaymentPopup.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closePopup('localPaymentPopup', false)">&times;</span>
            <h2>Verificar Código de Pedido</h2>
            <div class="code-verify-container">
                <input type="text" id="verifyCodeInput" placeholder="Ingrese el código del pedido">
                <button id="verifyCodeBtn">Verificar</button>
            </div>
            <p id="codeError" class="error-message" style="display: none;">Código Inválido</p>
        </div>
    `;
    document.body.appendChild(localPaymentPopup);
    showPopup('localPaymentPopup');

    document.getElementById('verifyCodeBtn').addEventListener('click', async function() {
        const code = document.getElementById('verifyCodeInput').value;
        try {
            const response = await fetch('/verificar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.valid) {
                closePopup('localPaymentPopup');
                // Usar cartItems en lugar de data.products para mostrar el carrito actual
                showChatInterface(code, cartItems);
                // Guardar el código activo
                localStorage.setItem('activeOrderCode', code);
            } else {
                document.getElementById('codeError').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('codeError').style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function showChatInterface(code, products) {
    // Eliminar popup anterior si existe
    const existingPopup = document.getElementById('chatPopup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const chatPopup = document.createElement('div');
    chatPopup.classList.add('popup');
    chatPopup.id = 'chatPopup';
    chatPopup.innerHTML = `
        <div class="popup-content chat-popup">
            <span class="close" onclick="closePopup('chatPopup', false)">&times;</span>
            <div class="chat-container">
                <div class="order-details">
                    <h3>Detalles del Pedido</h3>
                    <div class="order-items">
                        ${cartItems.map(item => `
                            <div class="order-item">
                                <span>${item.quantity} ${item.name}</span>
                                <span>${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button id="backToCartBtn" class="back-to-cart">Volver al Carrito</button>
                </div>
                <div class="chat-interface">
                    <div class="chat-messages" id="chatMessages">
                        <p class="chat-info">Chat con el administrador</p>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="messageInput" placeholder="Escriba su mensaje...">
                        <button onclick="sendMessage()">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatPopup);
    showPopup('chatPopup');

    // Agregar evento al botón de volver al carrito
    document.getElementById('backToCartBtn').addEventListener('click', function() {
        closePopup('chatPopup', false);
        document.getElementById('floatingCart').click();
    });
}

// Mostrar/ocultar popup de login/register
function togglePopup(popupId) {
const popup = document.getElementById(popupId);
popup.style.display = popup.style.display === 'none' || popup.style.display === '' ? 'block' : 'none';
}

// Mostrar/ocultar menú de usuario al hacer clic en el avatar
document.getElementById('userAvatar').addEventListener('click', function() {
    const userMenu = document.getElementById('userMenu');
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
});

// Evento para cerrar sesión
document.getElementById('logout').addEventListener('click', async function() {
    const response = await fetch('/logout', { 
        method: 'POST', 
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // CSRF token
        } 
    });

    if (response.ok) {
        alert('Sesión cerrada exitosamente');
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('authButtons').style.display = 'flex';
    } else {
        alert('Error al cerrar sesión');
    }
});
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Envío de formulario de registro
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/'; // Redireccionar a la página principal
            window.location.reload(true); // Forzar recarga para actualizar el estado de la sesión
        } else {
            alert('Error en el registro: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro');
    }
});

// Envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/'; // Redireccionar a la página principal
            window.location.reload(true); // Forzar recarga para actualizar el estado de la sesión
        } else {
            alert('Error en el inicio de sesión: ' + (data.message || 'Credenciales incorrectas'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el inicio de sesión');
    }
});

// Control deslizante de banners
const bannerContainer = document.querySelector('.banner-container');
const banners = document.querySelectorAll('.vertical-banner img');
let scrollAmount = 0;
const bannerWidth = bannerContainer.offsetWidth;
let autoScroll;

function startAutoScroll() {
    autoScroll = setInterval(() => {
        scrollAmount += bannerWidth;
        if (scrollAmount >= bannerContainer.scrollWidth) {
            scrollAmount = 0;
        }
        bannerContainer.style.transform = `translateX(-${scrollAmount}px)`;
    }, 3000);
}

document.getElementById('banners').addEventListener('wheel', (event) => {
    clearInterval(autoScroll);
    event.preventDefault();
    if (event.deltaY > 0) {
        scrollAmount += bannerWidth;
        if (scrollAmount >= bannerContainer.scrollWidth) {
            scrollAmount = 0;
        }
    } else {
        scrollAmount -= bannerWidth;
        if (scrollAmount < 0) {
            scrollAmount = bannerContainer.scrollWidth - bannerWidth;
        }
    }
    bannerContainer.style.transform = `translateX(-${scrollAmount}px)`;
    startAutoScroll();
});

startAutoScroll();

// ...existing code...
document.getElementById('logout-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cerrar sesión');
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el inicio de sesión');
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro');
    }
});
// ...existing code...

function showPaymentPopup() {
    const paymentPopup = document.createElement('div');
    paymentPopup.classList.add('popup');
    paymentPopup.id = 'paymentPopup';
    paymentPopup.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closePopup('paymentPopup')">&times;</span>
            <h2>Información de Pago</h2>
            <form class="payment-form" id="paymentForm">
                <input type="text" placeholder="Nombre y apellido" required>
                <input type="text" placeholder="Dirección completa" required>
                <input type="text" placeholder="Número de celular" required>
                <div class="card-details">
                    <input type="text" placeholder="Número de tarjeta" required>
                    <input type="text" placeholder="MM/YY" required>
                    <input type="text" placeholder="CVV" required>
                </div>
                <button type="submit">Confirmar Pago</button>
            </form>
        </div>
    `;
    document.body.appendChild(paymentPopup);
    showPopup('paymentPopup');

    // Evento para procesar el pago
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Pago procesado correctamente');
        closePopup('paymentPopup', true); // Aquí sí queremos limpiar el carrito
        cartItems = []; // Limpiar carrito solo después de un pago exitoso
        updateCartCount();
    });
}

// Agregar función para eliminar productos del carrito
async function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    updateCartDisplay();

    // Si hay un código activo, actualizar el pedido en el servidor
    const activeCode = localStorage.getItem('activeOrderCode');
    if (activeCode) {
        try {
            await updateOrder(activeCode, cartItems);
            
            // Actualizar la interfaz del chat si está abierta
            const chatPopup = document.getElementById('chatPopup');
            if (chatPopup && chatPopup.style.display === 'block') {
                showChatInterface(activeCode, cartItems);
            }
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
        }
    }
}

// Agregar función para limpiar el código activo
function clearActiveOrder() {
    localStorage.removeItem('activeOrderCode');
    cartItems = [];
    updateCartCount();
}

// Modificar la función que muestra el carrito
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = '';
    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `
            <div class="cart-item">
                <span class="cart-item-details">
                    <strong>${item.quantity}</strong> ${item.name} - ${item.price}
                </span>
                <button class="remove-item" onclick="removeFromCart(${index})" title="Eliminar producto">×</button>
            </div>
        `;
        cartItemsList.appendChild(itemElement);
    });
}

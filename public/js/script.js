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

function addToCart(productName, quantity, price) {
    const product = {
        name: productName,
        quantity: quantity,
        price: price
    };
    cartItems.push(product);
    updateCartCount();
    alert(`Añadido ${quantity} de ${productName} al carrito.`);
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
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = ''; // Limpiar contenido previo

    cartItems.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.quantity} ${item.name} - ${item.price}`;
        cartItemsList.appendChild(itemElement);
    });

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
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
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

// Mostrar popup con código y opción de copiar
function showCodePopup(uniqueCode) {
// Crear la ventana emergente para mostrar el código
const codePopup = document.createElement('div');
codePopup.classList.add('popup');
codePopup.id = 'codePopup';
codePopup.innerHTML = `
    <div class="popup-content">
        <span class="close" onclick="closePopup('codePopup')">&times;</span>
        <h2>Tu Código de Pedido</h2>
        <p>Código: <span id="orderCode">${uniqueCode}</span></p>
        <button id="copyCodeBtn">Copiar Código</button>
    </div>
`;
document.body.appendChild(codePopup);
showPopup('codePopup');

// Añadir funcionalidad para copiar el código
document.getElementById('copyCodeBtn').addEventListener('click', function() {
    const codeText = document.getElementById('orderCode').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        alert('Código copiado al portapapeles');
    });
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
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirmation = document.getElementById('registerPasswordConfirmation').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken // Incluimos el token CSRF
            },
            body: JSON.stringify({
                email: email,
                password: password,
                password_confirmation: passwordConfirmation
            })
        });

        if (response.ok) {
            alert('Registro exitoso');
            closePopup('registerPopup');
        } else {
            const errorData = await response.json();
            alert('Error en el registro: ' + errorData.message);
        }
    } catch (error) {
        alert('Error de red: ' + error.message);
    }
});

// Envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken // Incluimos el token CSRF
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            closePopup('loginPopup');
        } else {
            const errorData = await response.json();
            alert('Error en el inicio de sesión: ' + errorData.message);
        }
    } catch (error) {
        alert('Error de red: ' + error.message);
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

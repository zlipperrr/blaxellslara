<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Blaxells</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="icon" href="{{ asset('images/favicon.ico') }}" type="image/x-icon">
</head>
<body>
    <header>
        <img src="{{ asset('images/logo.png') }}" alt="Logo Blaxells" id="logo">
        <nav>
            <ul>
                <li><a href="{{ url('/') }}">Inicio</a></li>
                <li><a href="{{ url('/referencias') }}">Referencias</a></li>
                <li><a href="{{ url('/contacto') }}">Contacto</a></li>
            </ul>
        </nav>
        <!-- Botón de carrito -->
        <!-- 
        <div id="cart">
            <img src="images/cart-icon.png" alt="Carrito">
        </div>
        --> 
        <!-- Botones de Inicio de Sesión y Registro -->
        <div id="authButtons">
            @guest
                <button id="loginBtn">Iniciar Sesión</button>
                <button id="registerBtn">Registrarse</button>
            @endguest
            @auth
                <div id="userProfile">
                    <div class="avatar-container">
                        <img src="{{ asset('images/user-avatar.png') }}" alt="User Avatar" id="userAvatar">
                    </div>
                    <div id="userMenu" class="dropdown-content">
                        <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Cerrar Sesión</a>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                            @csrf
                        </form>
                    </div>
                </div>
            @endauth
        </div>
    </header>

    @auth
    @if(Auth::user()->isAdmin())
    <a href="{{ route('admin.index') }}">Panel de Administración</a>
    @endif
    @endauth

    <!-- Botón de carrito flotante -->
    <div id="floatingCart">
        <img src="{{ asset('images/cart-icon.png') }}" alt="Carrito">
        <span id="cartCount">0</span> <!-- Contador de productos -->
    </div>

    <!-- Ventana emergente de carrito -->
    <div id="cartPopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('cartPopup')">&times;</span>
            <h2>Tu Carrito</h2>
            <ul id="cartItemsList"></ul>
            <!-- Botón de proceder al pago se añadirá dinámicamente -->
        </div>
    </div>

    <!-- Ventana emergente de Inicio de Sesión -->
    <div id="loginPopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('loginPopup')">&times;</span>
            <h2>Iniciar Sesión</h2>
            <form id="loginForm">
                @csrf
                <label for="loginEmail">Correo electrónico:</label>
                <input type="email" id="loginEmail" required>
                <label for="loginPassword">Contraseña:</label>
                <input type="password" id="loginPassword" required>
                <button type="submit">Entrar</button>
            </form>

        </div>
    </div>

    <!-- Ventana emergente de Registro -->
    <div id="registerPopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('registerPopup')">&times;</span>
            <h2>Registrarse</h2>
            <form id="registerForm">
                <label for="registerEmail">Correo electrónico:</label>
                <input type="email" id="registerEmail" required>
                <label for="registerPassword">Contraseña:</label>
                <input type="password" id="registerPassword" required>
                <label for="registerPasswordConfirmation">Confirmar contraseña:</label>
                <input type="password" id="registerPasswordConfirmation" required>
                <button type="submit">Registrar</button>
            </form>
        </div>
    </div>
    <div id="main-container">
        <!-- Banner izquierdo -->
        <div class="vertical-banner left-banner">
            <img src="{{ asset('images/banner1.jpg') }}" alt="Banner Izquierdo">
        </div>
        <!-- Contenido principal -->
        <div id="content">
            <section id="intro-text">
                <p>SERVICIOS</p>
            </section>
            <main>
                <section id="products"></section>
                <div id="pagination">
                    <button id="prev" disabled>&laquo; Anterior</button>
                    <span id="page-info">Página 1</span>
                    <button id="next">Siguiente &raquo;</button>
                </div>
            </main>
        </div>
        <!-- Banner derecho -->
        <div class="vertical-banner right-banner">
            <img src="{{ asset('images/banner2.jpg') }}" alt="Banner Derecho">
        </div>
    </div>
    <footer>
        <p>Todos los derechos de la página pertenecen a Zlipper</p>
    </footer>
    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>

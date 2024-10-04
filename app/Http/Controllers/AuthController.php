<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Método para registrar un nuevo usuario
    public function register(Request $request)
    {
        \Log::info('Datos del registro:', $request->all());
        // Validar los datos del formulario
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Crear un nuevo usuario
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Autenticar al usuario
        Auth::login($user);

        // Redirigir al usuario a la página principal
        return response()->json(['success' => true], 200);
    }

    // Método para iniciar sesión
    public function login(Request $request)
    {
        // Validar los datos del formulario
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Intentar autenticar al usuario
        if (Auth::attempt($credentials)) {
            // Regenerar la sesión para proteger contra fijación de sesión
            $request->session()->regenerate();

            // Redirigir al usuario a la página principal
            return response()->json(['success' => true], 200);
        }

        // Si la autenticación falla, devolver mensaje de error
        return response()->json(['error' => 'Las credenciales no coinciden con nuestros registros.'], 401);
    }

    // Método para cerrar sesión
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true], 200);
    }
}

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
        try {
            $request->validate([
                'name' => 'required|string|max:255',  // Añadir validación para name
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Crear un nuevo usuario
            $user = User::create([
                'name' => $request->name,  // Usar el nombre proporcionado
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // Asignar rol de usuario por defecto
            ]);

            // Autenticar al usuario
            Auth::login($user);

            // Redirigir al usuario a la página principal
            return redirect('/'); // Redirección directa al index
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // Método para iniciar sesión
    public function login(Request $request)
    {
        try {
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
                return redirect('/'); // Redirección directa al index
            }

            // Si la autenticación falla, devolver mensaje de error
            return back()->withErrors([
                'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    // Método para cerrar sesión
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/'); // Redirección directa al index
    }
}

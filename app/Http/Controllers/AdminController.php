<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin'); // Middleware para proteger el acceso
    }

    public function index()
    {
        $users = User::all(); // Obtén todos los usuarios
        return view('admin.index', compact('users'));
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();

        return redirect()->route('admin.index')->with('status', 'Rol actualizado correctamente');
    }
}

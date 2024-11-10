<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return view('index');
});

// Ruta para guardar el pedido
Route::post('/guardar-pedido', [OrderController::class, 'store'])->name('guardar.pedido');

// Rutas para registro e inicio de sesión
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Ruta de cierre de sesión
Route::post('/logout', [AuthController::class, 'logout'])
    ->name('logout')
    ->middleware('auth');

// Ruta para admin de pagina
Route::group(['middleware' => 'admin', 'prefix' => 'admin'], function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/update-role/{id}', [AdminController::class, 'updateRole'])->name('admin.updateRole');
});

// Nueva ruta para verificar código
Route::post('/verificar-codigo', [OrderController::class, 'verifyCode']);

// Nueva ruta para actualizar pedido
Route::post('/actualizar-pedido', [OrderController::class, 'updateOrder']);

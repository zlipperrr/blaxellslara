<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validar la entrada
        $data = $request->validate([
            'code' => 'required|string|unique:orders',
            'products' => 'required|array',
        ]);

        // Crear un nuevo pedido
        try {
            $order = Order::create([
                'code' => $data['code'],
                'products' => json_encode($data['products']),
            ]);

            // Si todo está bien, devolver una respuesta exitosa
            return response()->json(['message' => 'Pedido procesado correctamente.'], 200);
        } catch (\Exception $e) {
            // En caso de error, devolver un mensaje de error
            return response()->json(['message' => 'Error al procesar el pedido: ' . $e->getMessage()], 500);
        }
    }
}

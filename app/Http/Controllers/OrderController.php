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

    public function verifyCode(Request $request)
    {
        $code = $request->input('code');
        $order = Order::where('code', $code)->first();

        if ($order) {
            try {
                // Decodificar y devolver los productos directamente sin volver a codificar
                return response()->json([
                    'valid' => true,
                    'products' => json_decode($order->products)
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Error al procesar los productos'
                ]);
            }
        }

        return response()->json([
            'valid' => false
        ]);
    }

    public function updateOrder(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
            'products' => 'required|array',
        ]);

        try {
            $order = Order::where('code', $data['code'])->first();
            if ($order) {
                $order->products = json_encode($data['products']);
                $order->save();
                return response()->json(['message' => 'Pedido actualizado correctamente.'], 200);
            }
            return response()->json(['message' => 'Pedido no encontrado.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el pedido: ' . $e->getMessage()], 500);
        }
    }
}

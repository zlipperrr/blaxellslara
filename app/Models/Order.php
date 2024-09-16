<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['code', 'products'];

    // Indicar que el campo 'products' debe ser tratado como un array
    protected $casts = [
        'products' => 'array',
    ];
}

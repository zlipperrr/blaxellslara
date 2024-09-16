<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Verificar si la tabla 'users' existe antes de añadir la columna 'role'
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'role')) {
                    // Añadir la columna 'role' solo si no existe
                    $table->string('role')->default('user');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // Verificar si la tabla 'users' existe antes de eliminar la columna 'role'
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'role')) {
                    // Eliminar la columna 'role' solo si existe
                    $table->dropColumn('role');
                }
            });
        }
    }
};

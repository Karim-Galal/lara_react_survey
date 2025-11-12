<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return 'welcome';
});


// require __DIR__.'/api.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

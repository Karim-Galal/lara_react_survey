<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SurveyController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);

// This route is just for testing — it returns the current logged-in user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// survye routes
Route::middleware('auth:sanctum')->group(function () {
  // using slug  to get rouet
  // Route::get('/surveys/{survey:slug}', [SurveyController::class, 'show']);

  // Route::apiResource('surveys', SurveyController::class);
  // Route::apiResource('surveys', SurveyController::class)->except(['show']);

  Route::apiResource('surveys', SurveyController::class);

  Route::get('/surveys/view/{slug}', [SurveyController::class, 'show']);

  // route for creating answers
  Route::post('/surveys/{survey}/answer', [SurveyController::class, 'storeAnswers']);




  Route::post('/logout', [AuthController::class, 'logout']);
});
// unproject surveys route for test with postman
// Route::apiResource('surveys', SurveyController::class);

// Route::get('/surveys', [SurveyController::class, 'index']);

Route::get('/test', function () {
    return response()->json(['status' => 'API working!']);
});


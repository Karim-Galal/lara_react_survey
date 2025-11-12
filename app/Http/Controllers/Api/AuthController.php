<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Auth\SignupRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function signup(SignupRequest $request)
    {
        // The incoming request is valid...

        // Retrieve the validated input data...
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        // Logic for signing up the user goes here...

        return response([
            'user' =>  new UserResource($user),
            'token' => $token,
        ]);
    }

    public function login(LoginRequest $request)
    {
        // The incoming request is valid...

        // Retrieve the validated input data...
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        // Logic for logging in the user goes here...

        // $user = User::where('email', $credentials['email'])->first();

        // // Check password
        // if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        //     return response()->json([
        //         'message' => 'The provided credentials are incorrect.',
        //     ], 422);
        // }

        if (! Auth::attempt($credentials, $remember)) {
            return response()->json([
              'error' => 'The provided credentials are incorrect.'
            ], 422);
        }

        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' =>  new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response([
          'success' => true,
        ]);
    }

    public function me( Request $request) {

      $user = $request->user();
      $token = $user->currentAccessToken();

      return response([
            'user' =>  new UserResource($user),
            'token' => $token,
        ]);

    }
}

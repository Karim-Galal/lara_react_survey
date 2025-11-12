<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:1000',
            'image' => 'nullable|image|max:2048',
            // 'slug' => 'nullable|string|max:1000|unique:surveys,slug',
            'description' => 'nullable|string',
            'data' => 'nullable',
            'status' => 'boolean',
            'expires_at' => 'nullable|date|after_or_equal:today',
            'questions' => 'array|nullable',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('questions') && is_string($this->questions)) {
            $this->merge([
                'questions' => json_decode($this->questions, true),
            ]);
        }

        $this->merge([
            'user_id' => $this->user()->id,
            # for postman
            // 'user_id' => $this->user()->id ?? 1,
        ]);
    }
}

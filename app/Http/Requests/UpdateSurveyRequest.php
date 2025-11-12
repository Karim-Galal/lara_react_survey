<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $survey = $this->route(param: 'survey');

        if ($this->user()->id !== $survey->user_id) {
            return false;
        }

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
          'title' => 'sometimes|required|string|max:1000',
          'image' => 'nullable|image|max:2048',
          'description' => 'nullable|string',
          'data' => 'nullable',
          'status' => 'nullable|boolean',
          'expire_at' => 'nullable|date|after_or_equal:today',
          'questions' => 'nullable|array',
          // 'questions.*.id' => 'nullable|integer|exists:survey_questions,id',
          // 'questions.*.question' => 'required_with:questions|string|max:2000',
          // 'questions.*.description' => 'nullable|string',
          // 'questions.*.data' => 'present',
      ];
    }

    // In App\Http\Requests\UpdateSurveyRequest.php

    protected function prepareForValidation()
    {
        if ($this->has('questions')) {
            $questions = $this->input('questions');

            if (is_string($questions)) {
                $decoded = json_decode($questions, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge(['questions' => $decoded]);
                }
            }
        }
    }





}

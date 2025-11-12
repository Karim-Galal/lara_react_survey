<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSurveyAnswersRequest;
use App\Models\Survey;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Http\Request; // use correct Request
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use App\Http\Enums\QuestionTypeEnum; // adjust namespace if different
use App\Http\Requests\UpdateSurveyRequest;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // get the current logged-in user
        // $user = $request->user();
        // $surveys = $user->surveys()->latest()->paginate(10);
        $surveys = Survey::latest()->paginate(5);

        return SurveyResource::collection( $surveys);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request){

        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // for postman
        // $data = $request->validated();
        // $data['user_id'] = 1;

        if ($request->hasFile('image')  ) {
            $relativePath = $this->saveImage($request->file('image'));
            $data['image'] = $relativePath ?? null;
        }


        // creating survey withou slug first to get the id
        $survey = Survey::create($data);

        // then update the slug with the id
        $survey->slug = Str::slug($request->input('title')) . '-' . $survey->id;
        $survey->save();

        if ($request->filled('questions')) {

          foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;

            $this->createQuestion($question);
          }
        }

        return response()->json([
            'data' => new SurveyResource($survey),
            'success' => true,
            'message' => 'Survey saved successfully',
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    // public function show(Survey $survey, Request $request)
    // {

    //     return new SurveyResource($survey);
    // }
    public function show($slug)
    {
        // $survey = Survey::where('slug', $slug)->first();
        $survey = Survey::where('slug', $slug)
        ->with('questions')
        ->first();

        if (!$survey) {
            return response()->json([
                'message' => 'Survey not found.',
            ], 404);
        }

        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        if (!$survey) {
            return response()->json(['message' => 'Survey not found'], 404);
        }

        $user = $request->user();

        // Check if the user owns this survey
        if ($user->id !== $survey->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get validated base fields (title, status, etc.)
        $data = $request->validated();

        /**
         * 🔧 Fix 1 — Decode questions if sent as JSON string
         * When sent via FormData, questions come as a string like "[{...}, {...}]"
         */
        if ($request->has('questions')) {
            $questions = json_decode($request->input('questions'), true);
        } else {
            $questions = [];
        }

        // 🔧 Fix 2 — Handle image upload correctly
        if ($request->hasFile('image')) {
            // Save new image
            $relativePath = $this->saveImage($request->file('image'));

            // Delete old image if exists
            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }

            $data['image'] = $relativePath;
        }

        // 🔧 Fix 3 — Update base survey data
        $survey->update($data);

        // Update slug if title changed
        if ($request->filled('title')) {
            $survey->slug = Str::slug($request->input('title')) . '-' . $survey->id;
            $survey->save();
        }

        // 🔧 Fix 4 — Handle questions safely
        $existingQuestionsId = $survey->questions()->pluck('id')->toArray();
        $newQuestionsId = Arr::pluck($questions, 'id');

        $toDelete = array_diff($existingQuestionsId, $newQuestionsId);
        $toAdd = array_diff($newQuestionsId, $existingQuestionsId);

        // Delete removed questions
        if (!empty($toDelete)) {
            SurveyQuestion::whereIn('id', $toDelete)->delete();
        }

        // Add or update questions
        foreach ($questions as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            } else {
                $this->updateQuestion($question['id'], $question);
            }
        }

        return new SurveyResource($survey);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey , Request $request)
    {

        $user = request()->user();

        // check if the user is the owner of the survey
        if ($user->id !== $survey->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // delete image if exists
        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        // delete related questions
        $survey->questions()->delete();

        // delete the survey
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully']);
    }

    protected function storeAnswers( StoreSurveyAnswersRequest $request , Survey $survey ) {

      $validated = $request->validated();

      foreach( $validated['answers']  as $question_id => $answer ) {

        $question = SurveyQuestion::where([
              'id' => $question_id,
              'survey_id' => $survey->id
          ])->first();

        if (!$question ) {
          return response("Invalid question ID: $question_id", 400);
        }

        $data = [
          'survey_question_id' => $question_id,
          'survey_answer_id'=> $survey->id,
          'answer' => is_array($answer) ? json_encode($answer) : $answer,
        ];

        $questionAnswer = SurveyQuestionAnswer::create($data);
      }

      return response('Answers submitted successfully',200);

    }

    private function saveImage(UploadedFile $image)
    {
        $path = Storage::disk('public')->putFile('images/surveys', $image);
        return Storage::url($path);
    }

    private function saveImage1($image)
    {
        if (is_array($image)) {
            $image = $image[0];
        }

        // إزالة الجزء "data:image/png;base64,"
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $image = substr($image, strpos($image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif
        } else {
            throw new \Exception('Invalid image data');
        }

        $image = str_replace(' ', '+', $image);
        $imageData = base64_decode($image);

        if ($imageData === false) {
            throw new \Exception('Base64 decode failed');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!file_exists($absolutePath)) {
            mkdir($absolutePath, 0755, true);
        }

        file_put_contents($absolutePath . $file, $imageData);

        return $relativePath;
    }

    private function saveImage2($image)
    {

        if ($image instanceof \Illuminate\Http\UploadedFile) {
            $path = $image->store('images', 'public');
            return 'storage/' . $path;
        }

        throw new \Exception('No valid image uploaded');
    }

      protected function createQuestion(array $questionData)
    {
        // ensure `data` is string (JSON) if passed as array
        if (isset($questionData['data']) && is_array($questionData['data'])) {
            $questionData['data'] = json_encode($questionData['data']);
        }

        $validator = Validator::make($questionData, [
            'survey_id' => 'required|exists:surveys,id',
            'question' => 'required|string|max:2000',
            'type' => [new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        $validated = $validator->validate();

        return SurveyQuestion::create($validated);
    }

    protected function updateQuestion($id, array $questionData)
    {
        $question = SurveyQuestion::findOrFail($id);

        if (isset($questionData['data']) && is_array($questionData['data'])) {
            $questionData['data'] = json_encode($questionData['data']);
        }

        $validator = Validator::make($questionData, [

            'type' => [new Enum(QuestionTypeEnum::class)],
            'question' => 'required|string|max:2000',
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        $question->update($validator->validated());

        return $question;
    }
}

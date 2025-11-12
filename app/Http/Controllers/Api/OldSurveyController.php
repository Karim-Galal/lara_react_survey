<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyQuestion;
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

class OldSurveyController extends Controller
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

        // check if the user is the owner of the survey
        if ($user->id !== $survey->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validated();

        // update image if exiss
        if ($request->hasFile('image')) {
            $relativePath = $this->saveImage($request->input('image'));

            // delete old image if exists
            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }

            $data['image'] = $relativePath;
        }

        // update data
        $survey->update($data);

        // update slug if title changed
        if ($request->filled('title')) {
            $survey->slug = Str::slug($request->input('title')) . '-' . $survey->id;
            $survey->save();
        }

        // all question before update
        $existingQuestionsId = $survey->questions()->pluck('id')->toArray();
        // questions to be added or updated
        // $newQuestionsId = array_filter(array_column($data['questions'], 'id'));
        $newQuestionsId = Arr::pluck($data['questions'], 'id');

        // questions to delete , no longer needed
        $toDelete = array_diff($existingQuestionsId, $newQuestionsId);
        // questions to add wasn't there before update
        $toAdd = array_diff($newQuestionsId, $existingQuestionsId);

        // delete questions that are no longer needed
        if (!empty($toDelete)) {
            SurveyQuestion::whereIn('id', $toDelete)->delete();
        }

        foreach ($data['questions'] as $question) {
            // if the question is to be added
            if (in_array( $question['id'], $toAdd)) {
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
    // this is for base24 files
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

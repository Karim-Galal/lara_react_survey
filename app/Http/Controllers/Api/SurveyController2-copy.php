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

class SurveyController extends Controller
{
    public function index(Request $request)
    {
        $surveys = Survey::latest()->paginate(10);
        return SurveyResource::collection($surveys);
    }

    public function store(StoreSurveyRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        if ($request->has('image')) {
            $relativePath = $this->saveImage($request->input('image'));
            $data['image'] = $relativePath ?? null;
        }

        // create without slug to get id
        $survey = Survey::create($data);

        // then update slug using id to guarantee uniqueness
        $survey->slug = Str::slug($request->input('title')) . '-' . $survey->id;
        $survey->save();

        // create questions if provided (questions expected as array)
        if (!empty($data['questions']) && is_array($data['questions'])) {
            foreach ($data['questions'] as $question) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        return new SurveyResource($survey->fresh());
    }

    public function show(Survey $survey, Request $request)
    {
        return new SurveyResource($survey);
    }

    public function update(StoreSurveyRequest $request, Survey $survey)
    {
        $user = $request->user();

        // authorization: only owner can update
        if ($user->id !== $survey->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validated();

        // handle image replacement
        if ($request->has('image')) {
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

        // update survey fields
        $survey->update($data);

        // update slug if title changed
        if ($request->filled('title')) {
            $survey->slug = Str::slug($request->input('title')) . '-' . $survey->id;
            $survey->save();
        }

        // === QUESTIONS HANDLING ===
        // existing question ids in DB
        $existingQuestionsId = $survey->questions()->pluck('id')->toArray();

        // incoming questions (may be null)
        $incomingQuestions = $data['questions'] ?? [];

        // ids present in incoming request (only numeric ids)
        $incomingIds = array_filter(Arr::pluck($incomingQuestions, 'id'));

        // delete questions that were removed by the client
        $toDelete = array_diff($existingQuestionsId, $incomingIds);
        if (!empty($toDelete)) {
            SurveyQuestion::whereIn('id', $toDelete)->delete();
        }

        // iterate incoming questions: update if id exists, create if no id
        if (!empty($incomingQuestions) && is_array($incomingQuestions)) {
            foreach ($incomingQuestions as $q) {
                if (!empty($q['id'])) {
                    // update existing question
                    $this->updateQuestion($q['id'], $q);
                } else {
                    // create new question
                    $q['survey_id'] = $survey->id;
                    $this->createQuestion($q);
                }
            }
        }

        return new SurveyResource($survey->fresh());
    }

    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();

        if ($user->id !== $survey->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // delete image file
        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        // delete related questions and survey
        $survey->questions()->delete();
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully']);
    }

    protected function saveImage($image)
    {
        // remove data prefix and decode base64
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));

        // ensure uploads folder exists
        $dir = public_path('uploads/images');
        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        // generate filename
        $fileName = uniqid() . '.png';
        $filePath = 'uploads/images/' . $fileName;

        // save file
        file_put_contents(public_path($filePath), $imageData);

        return $filePath;
    }

    protected function createQuestion(array $questionData)
    {
        // ensure `data` is string (JSON) if passed as array
        if (isset($questionData['data']) && is_array($questionData['data'])) {
            $questionData['data'] = json_encode($questionData['data']);
        }

        $validator = Validator::make($questionData, [
            'survey_id' => 'required|exists:surveys,id',
            'type' => [new Enum(QuestionTypeEnum::class)],
            'question' => 'required|string|max:2000',
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    protected function updateQuestion($id, array $questionData)
    {
        $question = SurveyQuestion::findOrFail($id);

        if (isset($questionData['data']) && is_array($questionData['data'])) {
            $questionData['data'] = json_encode($questionData['data']);
        }

        $validator = Validator::make($questionData, [
            // id rule not necessary here because we already fetched the model
            'type' => [new Enum(QuestionTypeEnum::class)],
            'question' => 'required|string|max:2000',
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        $question->update($validator->validated());

        return $question;
    }
}

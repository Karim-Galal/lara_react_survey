<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyQuestion extends Model
{
    protected $fillable = [
      'question',
      'survey_id',
      'type',
      'description',
      'data',
    ];

    public function surveys() {
      return $this->belongsTo( Survey::class );
    }
}

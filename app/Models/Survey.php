<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\FuncCall;

class Survey extends Model
{
    /** @use HasFactory<\Database\Factories\SurveyFactory> */
    use HasFactory;

    protected $fillable = [
      'user_id',
      'image',
      'title',
      'slug',
      'status',
      'description',
      'expire_at',
      'created_at',
      'updated_at',
    ];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }
}

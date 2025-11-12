<?php

namespace App\Http\Enums;


enum QuestionTypeEnum: string
{
    case TEXT = 'text';
    case SELECT = 'select';
    case TEXTAREA = 'textarea';
    case CHECKBOX = 'checkbox';
    case RADIO = 'radio';
}

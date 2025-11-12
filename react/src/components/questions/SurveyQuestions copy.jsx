import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import QuestionEditor from './QuestionEditor';


const SurveyQuestions = ({survey, onSurveyUpdate}) => {

  const [model , setModel ] = useState( {...survey} );

  const addQuestion = () => {

    setModel({

      ...model,
      questions : [
        ...model.questions,
        {
          id: uuidv4(),
          type: 'text',
          question: '',
          description: '',
          data: {}
        }
      ]
    });
  }

  const changeQuestion = (question) => {
    // check if question exists
    if (!question) return;

    const newQuestions = model.questions.map((q) => {

      if (q.id === question ) {
        return {...question};
      }
      return q;

    });

    setModel({
      ...model,
      newQuestions
    })

  }

  const DeleteQuestion = (question) => {
    // return all qeustions except the one to be deleted
    const newQuestions = model.questions.filter( (q) => q.id != question.id );

    setModel(
      {
        ...model,
        newQuestions,
      }
    )
  }


  useEffect(()=> {
    onSurveyUpdate(model);
  } , [model])


  return (
    <div>

    </div>
  )
}

export default SurveyQuestions

from pydantic import BaseModel
from typing import List


class QuestionBase(BaseModel):
    question_text: str
    answers: str
    correct_answers: str


class QuestionCreate(QuestionBase):
    set_id: int


class Question(QuestionBase):
    id: int
    set_id: int

    class Config:
        orm_mode = True


class SetOfQuestionsBase(BaseModel):
    name: str
    description: str


class SetOfQuestionsCreate(SetOfQuestionsBase):
    pass


class SetOfQuestions(SetOfQuestionsBase):
    id: int
    questions: List[Question] = []

    class Config:
        orm_mode = True
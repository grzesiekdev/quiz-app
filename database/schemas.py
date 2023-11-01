from pydantic import BaseModel
from typing import List


class QuestionBase(BaseModel):
    question_text: str
    answers: str
    correct_answers: str
    set_id: int
    

class QuestionCreate(QuestionBase):
    set_id: int


class Question(QuestionBase):
    id: int
    set_id: int

    class Config:
        from_attributes = True


class QuestionDelete(Question):
    pass


class SetOfQuestionsBase(BaseModel):
    name: str
    description: str


class SetOfQuestionsCreate(SetOfQuestionsBase):
    pass


class SetOfQuestions(SetOfQuestionsBase):
    id: int
    questions: List[Question] = []

    class Config:
        from_attributes = True


class SetOfQuestionsUpdate(SetOfQuestionsBase):
    pass


class QuestionUpdate(BaseModel):
    question_text: str
    answers: str
    correct_answers: str
    set_id: int


class TestResult(BaseModel):
    user_answers: list[str]
    correct_answers: list[str]

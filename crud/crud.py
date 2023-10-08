from sqlalchemy.orm import Session
import database.models as models
import database.schemas as schemas


def get_question(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()


def get_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Question).offset(skip).limit(limit).all()


def create_question(db: Session, question: schemas.QuestionCreate, set_id: int):
    db_question = models.Question(
        question_text=question.question_text,
        answers=question.answers,
        correct_answers=question.correct_answers,
        set_id=set_id  # Use the 'set_id' parameter from the function argument
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def get_set_of_questions(db: Session, set_id: int):
    return db.query(models.SetOfQuestions).filter(models.SetOfQuestions.id == set_id).first()


def get_sets_of_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SetOfQuestions).offset(skip).limit(limit).all()


def create_set_of_questions(db: Session, set_of_questions: schemas.SetOfQuestionsCreate):
    db_set_of_questions = models.SetOfQuestions(**set_of_questions.dict())
    db.add(db_set_of_questions)
    db.commit()
    db.refresh(db_set_of_questions)
    return db_set_of_questions


def get_questions_in_set(db: Session, set_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Question).filter(models.Question.set_id == set_id).offset(skip).limit(limit).all()


def create_question_in_set(db: Session, question: schemas.QuestionCreate, set_id: int):
    db_question = models.Question(**question.dict(), set_id=set_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

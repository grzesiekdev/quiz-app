from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from database import models, schemas
from database.database import engine
from crud import crud
from database import database

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
client = TestClient(app)

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("panel/index.html", {'request': request})


@app.post("/questions/", response_model=schemas.Question)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(database.get_db)):
    set_of_questions = crud.get_set_of_questions(db, set_id=question.set_id)
    if set_of_questions is None:
        raise HTTPException(status_code=404, detail="Set of questions not found")

    if not question.correct_answers:
        raise HTTPException(status_code=400, detail="At least one correct answer is required")

    return crud.create_question(db=db, question=question, set_id=question.set_id)



@app.get("/questions/", response_model=list[schemas.Question])
def read_questions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    questions = crud.get_questions(db, skip=skip, limit=limit)
    return questions


@app.get("/questions/{question_id}", response_model=schemas.Question)
def read_question(question_id: int, db: Session = Depends(database.get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question


@app.put("/questions/{question_id}", response_model=schemas.Question)
def update_question(
    question_id: int, question: schemas.QuestionUpdate, db: Session = Depends(database.get_db)
):
    db_question = crud.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    updated_question = crud.update_question(db=db, question_id=question_id, question=question)
    return updated_question


@app.delete("/questions/{question_id}", response_model=schemas.Question)
def delete_question(question_id: int, db: Session = Depends(database.get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    crud.delete_question(db=db, question_id=question_id)
    return db_question

# Routes for managing sets of questions


@app.post("/sets-of-questions/", response_model=schemas.SetOfQuestions)
def create_set_of_questions(set_of_questions: schemas.SetOfQuestionsCreate, db: Session = Depends(database.get_db)):
    return crud.create_set_of_questions(db=db, set_of_questions=set_of_questions)


@app.get("/sets-of-questions/", response_model=list[schemas.SetOfQuestions])
def read_sets_of_questions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    sets_of_questions = crud.get_sets_of_questions(db, skip=skip, limit=limit)
    return sets_of_questions


@app.get("/sets-of-questions/{set_id}", response_model=schemas.SetOfQuestions)
def read_set_of_questions(set_id: int, db: Session = Depends(database.get_db)):
    db_set_of_questions = crud.get_set_of_questions(db, set_id=set_id)
    if db_set_of_questions is None:
        raise HTTPException(status_code=404, detail="Set of questions not found")
    return db_set_of_questions


@app.get("/sets-of-questions/{set_id}/questions/", response_model=list[schemas.Question])
def read_questions_in_set(set_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    questions = crud.get_questions_in_set(db, set_id, skip=skip, limit=limit)
    return questions


@app.post("/sets-of-questions/{set_id}/questions/", response_model=schemas.Question)
def create_question_in_set(set_id: int, question: schemas.QuestionCreate, db: Session = Depends(database.get_db)):
    return crud.create_question_in_set(db=db, question=question, set_id=set_id)


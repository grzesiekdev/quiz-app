from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, index=True)
    answers = Column(String)
    correct_answers = Column(String)

    set_id = Column(Integer, ForeignKey("sets_of_questions.id"))
    set_of_questions = relationship("SetOfQuestions", back_populates="questions")


class SetOfQuestions(Base):
    __tablename__ = "sets_of_questions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)

    questions = relationship("Question", back_populates="set_of_questions", cascade="all, delete-orphan")
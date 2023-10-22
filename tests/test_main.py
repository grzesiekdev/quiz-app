import pytest
from fastapi.testclient import TestClient
from .database import Base, engine, SessionLocal, override_get_db
import sys
import os
import re
import json
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))
from main import app
from database import database


app.dependency_overrides[database.get_db] = override_get_db
client = TestClient(app)


def test_read_home_page():
    response = client.get('/')
    assert response.status_code == 200


def test_read_new_quiz():
    response = client.get('/new-quiz')
    assert response.status_code == 200


def test_read_new_question():
    response = client.get('/new-question')
    assert response.status_code == 200


def test_create_new_question_set():
    response = client.post(
        "/set-of-questions/",
        headers={"Content-Type": "application/json"},
        json={
            "name": "Test name",
            "description": "Test description",
            "questions": []
        },
    )

    assert response.status_code == 200

    response_data = response.json()
    id_pattern = r'^\d{1,5}$'

    assert re.match(id_pattern, str(response_data['id']))
    assert response_data['description'] == 'Test description'
    assert response_data['name'] == 'Test name'


def test_create_new_question():
    response = client.post(
        "/questions/",
        headers={"Content-Type": "application/json"},
        json={
            "question_text": "What is the capital of Poland?",
            "answers": "Warsaw,London,Madrid,Berlin",
            "correct_answers": "Warsaw",
            "set_id": 1
        },
    )

    assert response.status_code == 200

    response_data = response.json()
    id_pattern = r'^\d{1,5}$'

    assert re.match(id_pattern, str(response_data['id']))
    assert response_data['question_text'] == 'What is the capital of Poland?'
    assert response_data['answers'] == 'Warsaw,London,Madrid,Berlin'
    assert response_data['set_id'] == 1


def test_create_new_question_with_incorrect_set_id():
    response = client.post(
        "/questions/",
        headers={"Content-Type": "application/json"},
        json={
            "question_text": "What is the capital of Poland?",
            "answers": "Warsaw,London,Madrid,Berlin",
            "correct_answers": "Warsaw",
            "set_id": 0
        },
    )

    assert response.status_code == 404
    assert response.json().get('detail', None) == 'Set of questions not found'


def test_create_new_question_without_answers():
    response = client.post(
        "/questions/",
        headers={"Content-Type": "application/json"},
        json={
            "question_text": "What is the capital of Poland?",
            "answers": "",
            "correct_answers": "Warsaw",
            "set_id": 1
        },
    )

    assert response.status_code == 400
    assert response.json().get('detail', None) == 'There has to be at least one correct answer'


def test_create_new_question_without_question():
    response = client.post(
        "/questions/",
        headers={"Content-Type": "application/json"},
        json={
            "question_text": "",
            "answers": "Warsaw,London,Madrid,Berlin",
            "correct_answers": "Warsaw",
            "set_id": 1
        },
    )

    assert response.status_code == 400
    assert response.json().get('detail', None) == 'You have to specify question'


def test_create_new_question_without_correct_answers():
    response = client.post(
        "/questions/",
        headers={"Content-Type": "application/json"},
        json={
            "question_text": "What is the capital of Poland?",
            "answers": "Warsaw,London,Madrid,Berlin",
            "correct_answers": "",
            "set_id": 1
        },
    )

    assert response.status_code == 400
    assert response.json().get('detail', None) == 'At least one correct answer is required'


def test_read_question():
    response = client.get('/questions/1')
    assert response.status_code == 200
    assert response.json() == {
            "question_text": "What is the capital of Poland?",
            "answers": "Warsaw,London,Madrid,Berlin",
            "correct_answers": "Warsaw",
            "set_id": 1,
            "id": 1
        }


def test_read_non_existing_question():
    response = client.get('/questions/0')
    assert response.status_code == 404
    assert response.json().get('detail', None) == 'Question not found'


# TODO: Test question PUT and DELETE


def test_read_set_of_questions():
    response = client.get('/set-of-questions/1')
    assert response.status_code == 200


def test_read_not_existing_set_of_questions():
    response = client.get('/set-of-questions/0')
    assert response.status_code == 404
    assert response.json().get('detail', None) == 'Set of questions not found'

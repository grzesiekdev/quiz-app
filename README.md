# Quiz App
## Why?
Aplikacja będzie służyć szybszemu przyswajaniu wiedzy, tworzeniu quizów, fiszek, oraz ogólnych pomocy dydaktycznych. 
## What?
W wersji MVP aplikacja będzie działać w przeglądarce. Użykownik będzie miał możliwość dodawania swoich własnych quizów / fiszek (pytanie / słówko + odpowiedź). Po dodaniu wszystkich słówek lub pytań, użytkownik będzie miał możliwość udostępnienia danego quizu innemu użytkownikowi, lub skorzystania z utworzonego zestawu samemu. W każdym pytaniu będzie opcja wprowadzenia odpowiedzi przez użytkownika. Po wpisaniu odpowiedzi (lub wypełnieniu całego zestawu) wyświetli się informacja czy odpowiedź jest poprawna.
## How? 
Aplikacja zostanie stworzona z wykorzystaniem następujących technologii:
+ Python + FastAPI
+ Javascript + CSS (Bootstrap)
+ SQLite
+ Docker
## Members
+ Daniel Tlałka 76061
+ Grzegorz Bednarski 76060
## How to run
1. Clone
```
git clone https://github.com/grzesiekdev/quiz-app.git
cd quiz-app
```
2. Build docker image
```
docker-compose up -d --build
```
3. Go to app in browser
```
http://127.0.0.1:8000/
```
+ Running alembic migrations
```
alembic upgrade head
cd tests
alembic upgrade head # for test database
```
+ Running tests
```
pytest # run in root directory
```
+ Docs are available at http://127.0.0.1:8000/docs
### Tips
+ How to open container with zsh
```
docker exec -it <container-name or ID> zsh
```
+ In case of encountering some errors, check logs of container
```
docker logs <container-name or ID>
```
+ If container doesn't work properly, check it's status
```
docker ps -a
```

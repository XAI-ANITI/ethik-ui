back_dev:
	python manage.py runserver

front_dev:
	npm run dev

install:
	pip install -r requirements.txt
	npm install

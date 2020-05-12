import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api

from faker import Faker


fake = Faker()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['POSTGRES_URI']
db = SQLAlchemy(app)
api = Api(app)


def setup_db(models_to_clear):
    db.create_all()
    for model in models_to_clear:
        for instance in model.query.all():
            db.session.delete(instance)

    db.session.commit()


def load_fixtures(ops):
    for op in ops:
        print(op)
        db.session.add(op)

    db.session.commit()


if __name__ == "__main__":
    from views import *
    app.run(host='0.0.0.0', debug=True, port=8000)

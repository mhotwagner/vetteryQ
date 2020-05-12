from flask import request

from app import app, fake, load_fixtures, api
from models import User, initialize_db
from api import UserListResource, FrameworkListResource, LanguageListResource

api.add_resource(UserListResource, '/api/users/')
api.add_resource(FrameworkListResource, '/api/frameworks/')
api.add_resource(LanguageListResource, '/api/languages/')


@app.route('/users/generate/')
def add_users():
    n = int(request.args.get('n', 10))
    load_fixtures(ops=[User(email=fake.email()) for _ in range(n)])
    return {'message': f'Created {n} new users'}, 200


@app.route('/health/')
def health_check():
    return 'OK', 200


@app.route('/init/')
def init():
    initialize_db()
    return 'OK', 200

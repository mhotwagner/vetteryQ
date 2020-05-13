from distutils.util import strtobool

import graphene
from flask import request
from flask_restful import Resource
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from models import User, Framework, Language


class LanguageSerializer:
    data = {}

    def __init__(self, language):
        self.data = {
            'id': language.id,
            'name': language.name,
            'backend': language.backend,
            'frontend': language.frontend,
        }


class LanguageListResource(Resource):
    def get(self):
        languages = Language.query.all()
        return {
            'items': [LanguageSerializer(language).data for language in languages]
        }


class FrameworkSerializer:
    data = {}

    def __init__(self, framework):
        self.data = {
            'id': framework.id,
            'name': framework.name,
            'language': LanguageSerializer(framework.language).data,
            'backend': framework.backend,
            'frontend': framework.frontend,
        }


class FrameworkListResource(Resource):
    def get(self):
        frameworks = Framework.query.all()
        return {
            'items': [FrameworkSerializer(framework).data for framework in frameworks]
        }


class UserSerializer:
    data = {}

    def __init__(self, user):
        self.data = {
            'id': user.id,
            'email': user.email,
            'backend': user.backend,
            'frontend': user.frontend,
            'fullstack': user.fullstack,
            'frameworks': [
                FrameworkSerializer(framework).data for framework in user.frameworks
            ],
            'languages': [LanguageSerializer(language).data for language in user.languages],
        }


class UserListResource(Resource):
    def get(self):

        backend = strtobool(request.args.get('backend'))
        frontend = strtobool(request.args.get('frontend'))
        languages = [int(l) for l in request.args.getlist('languages[]')]

        users = User.query.all()

        if backend and not frontend:
            users = [user for user in users if user.backend]
        elif frontend and not backend:
            users = [user for user in users if user.frontend]

        users = [
            user for user in users if
            set([l.id for l in user.languages]).intersection(set(languages))
        ]

        return {
            'items': [UserSerializer(user).data for user in users]
        }


# GraphQL Schema
class LanguageAttributes:
    name = graphene.String()


class LanguageObject(SQLAlchemyObjectType, LanguageAttributes):
    class Meta:
        model = Language
        interfaces = (graphene.relay.Node, )


class FrameworkAttributes:
    id = graphene.ID()
    name = graphene.String()

class FrameworkObject(SQLAlchemyObjectType):
    class Meta:
        model = Framework
        interfaces = (graphene.relay.Node, )


class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)


class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()

    language = graphene.relay.Node.Field(LanguageObject)

    languages = SQLAlchemyConnectionField(UserObject)

    framework = SQLAlchemyConnectionField(UserObject)

    user = SQLAlchemyConnectionField(UserObject)


schema = graphene.Schema(query=Query)

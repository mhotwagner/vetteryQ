from app import db, setup_db, load_fixtures

user_frameworks = db.Table(
    'user_frameworks',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('framework_id', db.Integer, db.ForeignKey('framework.id'), primary_key=True)
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)

    frameworks = db.relationship(
        'Framework', secondary=user_frameworks, lazy='subquery',
        backref=db.backref('users', lazy=True)
    )

    @property
    def languages(self):
        _languages = list(set([f.language for f in self.frameworks]))
        print(_languages)
        return _languages

    @property
    def backend(self):
        return any([
            f.backend for f in self.frameworks
        ])

    @property
    def frontend(self):
        return any([
            f.frontend for f in self.frameworks
        ])

    @property
    def fullstack(self):
        return self.backend and self.frontend

    def __repr__(self):
        return f'<User { self.email }>'


class Framework(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True, nullable=False)
    backend = db.Column(db.Boolean, nullable=False)
    frontend = db.Column(db.Boolean, nullable=False)

    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=False)
    language = db.relationship('Language', backref=db.backref('frameworks', lazy=True))

    def __repr__(self):
        return f'<Framework { str(self.name) }:{ str(self.language.name)}>'


class Language(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True, nullable=False)
    backend = db.Column(db.Boolean, nullable=False)
    frontend = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'<Language { str(self.name) }>'


def initialize_db():
    setup_db(
        models_to_clear=[Framework, Language, User],  # the order matters!
    )

    python = Language(name='python', backend=True, frontend=False)
    ruby = Language(name='ruby', backend=True, frontend=False)
    javascript = Language(name='javascript', backend=True, frontend=True)

    django = Framework(name='django', backend=True, frontend=False, language=python)
    flask = Framework(name='flask', backend=True, frontend=False, language=python)
    rails = Framework(name='rails', backend=True, frontend=False, language=ruby)
    node = Framework(name='node', backend=True, frontend=False, language=javascript)

    react = Framework(name='react', backend=False, frontend=True, language=javascript)
    angular = Framework(name='angular', backend=False, frontend=True, language=javascript)
    vue = Framework(name='vue', backend=False, frontend=True, language=javascript)

    load_fixtures(
        ops=[
            # languages
            python,
            ruby,
            javascript,
            Language(name='css', backend=False, frontend=True),
            Language(name='sass', backend=False, frontend=True),
            Language(name='scss', backend=False, frontend=True),

            # frameworks
            django,
            flask,
            rails,
            node,
            react,
            angular,
            vue,

            # users
            User(email='backend.developer@example.com', frameworks=[django, flask, rails]),
            User(email='frontend.developer@example.com', frameworks=[react, angular, vue]),
            User(email='fullstack.developer@example.com', frameworks=[django, flask, react]),
        ],
    )

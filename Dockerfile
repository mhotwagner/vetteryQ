FROM tiangolo/uwsgi-nginx-flask:python3.7

# init
RUN mkdir /vetteryQ
WORKDIR /vetteryQ

COPY requirements.txt /vetteryQ/

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt
# clean
#RUN apk del -r python3-dev postgresql
# prep
ENV PYTHONUNBUFFERED 1
COPY . /vetteryQ/

# pull official base image
FROM node:14

# set working directory
RUN mkdir /vqf
WORKDIR /vqf

# add `/vqf/node_modules/.bin` to $PATH
ENV PATH /vqf/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /vqf
RUN yarn install

# add app
COPY . /vqf

CMD yarn start 0.0.0.0:3000

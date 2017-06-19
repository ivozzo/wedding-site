FROM node:7.5

#Create server directory
RUN mkdir -p /usr/src/modserver

#Install server dependencies
COPY ./package.json /usr/src/modserver
WORKDIR /usr/src/modserver
RUN npm install

#Bundle server source
RUN mkdir -p /usr/src/modserver/Server
ADD ./Server/ /usr/src/modserver/Server/
RUN mkdir -p /usr/src/modserver/Server/frontend
COPY ./Server/frontend /usr/src/modserver/Server/frontend
WORKDIR /usr/src/modserver

#Port exposing
EXPOSE 8021

CMD [ "npm", "start" ]

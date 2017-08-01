FROM ubuntu:16.04

ENV NODE_VERSION = "v8.2.1"

#Updating image and installing 
RUN apt-get update && \ 
    apt-get install -y curl xz-utils && \
    apt-get clean

#Download and unzip NodeJS
RUN cd /opt/ && \
    curl -O https://nodejs.org/dist/v8.2.1/node-v8.2.1-linux-x64.tar.xz && \
    tar xf node-v8.2.1-linux-x64.tar.xz && \
    mv node-v8.2.1-linux-x64 /opt/node-js

#Create symbolic links
RUN ln -s /opt/node-js/bin/node /usr/bin/node && \
    ln -s /opt/node-js/bin/npm /usr/bin/npm && \
    ln -s /opt/node-js/bin/npx /usr/bin/npx

#Preparing environment
RUN mkdir -p /opt/wedding-site/App

#Copy all files required
COPY ./App /opt/wedding-site/App
COPY ./package.json /opt/wedding-site
COPY ./package-lock.json /opt/wedding-site

#Install Node dependencies
RUN cd /opt/wedding-site && \
    npm install

#Port exposing
EXPOSE 80

#Volume
VOLUME ["/opt"]

#Entrypoint
ENTRYPOINT ["/usr/bin/npm", "--prefix", "/opt/wedding-site", "start"]
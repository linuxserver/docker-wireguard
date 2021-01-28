FROM node:12.18.1


RUN mkdir -p /usr/

COPY . /usr

WORKDIR /usr/app
RUN npm install

EXPOSE 5000

ENTRYPOINT ["npm", "run"]
CMD ["start"]
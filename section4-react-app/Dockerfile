FROM node:14.16.0-alpine3.13
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app

# optimize docker cache so that npm install wont 
# rerun every time we made a tiny modification on 
# the main folder
COPY package*.json .
RUN npm install

# copy everything from local to the workdir
COPY . . 
ENV API_URL=http://api.myapp.com/
EXPOSE 3000
CMD ["npm", "start"]
FROM node:18

WORKDIR /app

#dependencies install

COPY package*.json ./
RUN npm install

#next code copy
COPY . .
EXPOSE 8000
CMD ["npm","start"]


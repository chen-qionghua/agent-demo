# This file is a template, and might need editing before it works on your project.
FROM node:16 AS compile

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

CMD ["npm", "run", "start"]

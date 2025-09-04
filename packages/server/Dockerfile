# 1. Use an official Node.js runtime as a parent image
FROM node:20-alpine

# 2. Set the working directory in the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy Prisma schema
COPY prisma ./prisma/

# 6. Generate Prisma Client
RUN npx prisma generate

# 7. Copy the rest of your app's source code
COPY . .

# 8. Build TypeScript to JavaScript
RUN npm run build

# 9. Your app binds to port 5001 so you'll use the EXPOSE instruction
EXPOSE 5001

# 10. Define the command to run your app
CMD [ "npm", "start" ]
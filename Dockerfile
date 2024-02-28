FROM node:latest

# Set the working directory in the container
WORKDIR /app

ARG PORT

# Install pnpm
RUN npm i --no-fund -g pnpm@latest

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy files required by pnpm install
COPY pnpm-lock.yaml .

# Install dependencies
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript files
RUN pnpm run build

# Expose the port the app runs on
EXPOSE PORT

# Run the application
CMD ["pnpm", "start"]

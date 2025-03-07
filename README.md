# Notes API

## Overview

The Notes API is a RESTful API that allows users to manage notes efficiently. Notes are organized into folders for better categorization. The API is designed to be simple, secure, and scalable.

## Features
- User authentication using JWT (Register and login)
- CRUD operations for folders.
- CRUD operations for notes with two types of notes:
   - Text Notes: Contains a single text body.
   - List Notes: Contains multiple list items with text bodies.
- Filter notes by folder

## Prerequisites
- Node.js (version 18 or higher)
- Docker

## Installation

### Clone the repository:

 ```sh
  git clone https://github.com/nada3zz/notes-api
  cd notes-api
```

### Add credentials:
- copy the .env.example to the .env file and add credentials, the file includes example values for your reference.

### Run docker compose:

```sh
docker-compse up -d
```
### Migrate database schema: 

- Inside the **note-api container** Run this command:

 ```sh
npx prisma db push
```
### Setup the database interface:

- The database schema is defined using Prisma with PostgreSQL. To visualize the DB run:

```sh
npx prisma studio
```
or
- Set up a server on pgAdmin client

## API Documentation
The API documentation is available through Postman. 
- Import the collection and the environment into your postman client 

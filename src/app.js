const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUID (request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "Invalid Repository ID"});
  }

  return next();
}

function validateIdRepository(request, response, next){
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if(index < 0){
    return response.status(404).json({ error: "Repository not found" });
  }

  request.index = index;

  return next();
}

app.use('/repositories/:id', validateUID, validateIdRepository);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs }  = request.body;

  const repository = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[request.index].likes,
  }

  repositories[request.index] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repository = repositories[request.index];
  repository.likes = repository.likes + 1;

  return response.status(200).json(repository);
});

module.exports = app;

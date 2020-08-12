const express = require("express");
const cors = require("cors");

const { v4, validate } = require('uuid')

const app = express();

app.use(express.json());
app.use(cors());

function validadeRepoId(request, response, next) {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(400).json({ error: 'Invalid Repository ID.'})
  }

  return next()
}

app.use('/repositories/:id', validadeRepoId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
    const { title, url, techs} = request.body    

    if ( !title || !url || !techs ) {
      return response.status(400).json({error: 'Some fields are missing.'})
    }

    const repository = { id:v4(), title, url, techs, likes: 0}
    
    repositories.push(repository);
  

    return response.json(repository)
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex])
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs} = request.body
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})  }
  

  let likes = repositories[repositoryIndex].likes 

  const repository = {
    id,
    title,
    url,
    techs,
    likes   
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});


module.exports = app;

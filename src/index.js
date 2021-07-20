const express = require('express');
const { uuid, isUuid } = require('uuidv4') 

const app = express();

app.use(express.json()); // Precisa vir antes da aplicação

/**
 * MÉTODOS HTTP:
 * 
 * GET: busca informações do back-end
 * POST: criar informação no back-end
 * PUT/PATCH: alterar uma informação no back-end
 * DELETE: deletar uma informação no back-end
  */
 
/** 
 * TIPOS DE PARÂMETROS:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (atualizar/deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * MIDDLEWARE:
 * 
 * Interceptador de requisições que pode interromper totalmente ou alterar dados da requisição.
 */

const projects = [];

function logRequest(request, response, next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); //próximo middleware

    console.timeEnd(logLabel);
}

function validateProjectId( request, response, next){
const {id} = request.params;

if (!isUuid(id)) {
    return response.status(400).json ({ error: 'Invalid project ID.'});

}

return next();
}

app.get('/projects', ( request, response) => {
    
    const {title} = request.query;

   const results = title
   ? projects.filter(project => project.title.includes(title))
   : projects;
    
    return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner} = request.body;

   const project = { id: uuid(), title, owner};

   projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    
    const { id }  = request.params;
    const { title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0){
        return response.status(400).json({ error: "Project not found."})
    }

    const project = {
        id,
        title, 
        owner,
    }

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    
const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0){
        return response.status(400).json({ error: "Project not found."})
    }
    
    projects.splice(projectIndex, 1);
    
    return response.status(204).send();
});


app.listen(3333, () => {
    console.log('Back-end started!')
});
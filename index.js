const express = require("express");
const cors = require('cors')
const morgan = require('morgan')


morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})  

const app = express();

app.use(cors())
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :person`))

app.use(express.json())

let Datos = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const requestEntradas = Datos.length;
  const requestTime = new Date();
  response.send(
    `<p>PhoneBook has info for ${requestEntradas} people</p><br/><p>${requestTime}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(Datos);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = Datos.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Datos = Datos.filter((person) => person.id !== id);
  response.status(204).end();
});

const getGeneratedId = () => {
  return Math.floor(Math.random() * 10000);
};


app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name or number missing",
    });
  }
  const person = {
    id: getGeneratedId(),
    name: body.name,
    number: body.number,
  };
  Datos = Datos.concat(person);
  response.json(person);
});

const requestLogger = (request, response, next) =>{
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
}

app.use(requestLogger)


const unknowEndpoint = (request, reponse) => {
  reponse.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknowEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}/info`)
);

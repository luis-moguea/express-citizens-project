const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const citizens = [
    {id: 1, name: "Maria", nationality: "Venezuelan"},
    {id: 2, name: "Luis", nationality: "Colombian"},
    {id: 3, name: "Martha", nationality: "American"},
    {id: 4, name: "Andres", nationality: "Italian"},
    {id: 5, name: "Neil", nationality: "Peruvian"}
];

app.get("/api/citizens", (req, res) => {
    res.send(citizens);
});

app.get("/api/citizens/:id", (req, res) => {
    const citizensFilter = citizens.find(el => el.id === parseInt(req.params.id));
    if(!citizensFilter) {
        return res.status(404).send("Citizen does not exist")
    }
    res.send(citizensFilter);
});

const validateCitizen = (citizens) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        nationality: Joi.string().required()
    });
    return schema.validate(citizens)
};

app.post("/api/citizens", (req, res) => {

    const { error } = validateCitizen(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message)
    }

    const newCitizen = {
        id: citizens.length + 1,
        name: req.body.name,
        nationality: req.body.nationality
    }

    citizens.push(newCitizen);

    res.send(newCitizen);
})

app.put("/api/citizens/:id", (req, res) => {
    const citizensFilter = citizens.find(el => el.id === parseInt(req.params.id));
    if(!citizensFilter) {
        return res.status(404).send("Citizen does not exist");
    };

    const { error } = validateCitizen(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    citizensFilter.name = req.body.name;
    citizensFilter.nationality = req.body.nationality;
    res.send(citizensFilter);
});

app.delete("/api/citizens/:id", (req, res) => {
    const citizensFilter = citizens.find(el => el.id === parseInt(req.params.id));
    if(!citizensFilter) {
        return res.status(404).send("Citizen does not exist");
    };

    const index = citizens.indexOf(citizensFilter);
    citizens.splice(index, 1);
    res.send(citizensFilter)

})

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`))
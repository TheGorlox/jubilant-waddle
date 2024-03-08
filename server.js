const express = require('express');
const cors = require('cors');
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
let data = {wolEntries:[]};
let loadedData = fs.readFileSync('data.yaml', 'utf8');
loadedData = yaml.load(loadedData);
data.wolEntries.push(...loadedData.wolEntries);
app.get('/path/to/api',  (req, res) => {
    try{
        res.send(`
        <table class="table table-hover table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>`
        + data.wolEntries.map((entry, index) => {
            return `<tr>
            <th scope="row">${index}</th>
            <td>${entry.name}</td>
            <td>${entry.address}</td>
            <td><button class="btn btn-danger" onclick="deleteEntry(${index})">Delete</button></td>
          </tr>`})+`
          
        </tbody>
      </table>`);
    }
    catch (error) {
        res.status(500).send('Error occurred while fetching data');
    }
    
});

app.post('/wol', (req, res) => {
    try{
        console.log(req.body);
       data.wolEntries.push(req.body);
       let yamlStr = yaml.dump(data);

        fs.writeFileSync('data.yaml', yamlStr, 'utf8');
        res.send('Data saved successfully');
    }
    catch (error) {
        res.status(500).send('Error occurred while fetching data');
    }
    
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
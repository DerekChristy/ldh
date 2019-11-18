const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cloudinaryConfig = require('./config/cloudinaryConfig');
const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('*', cloudinaryConfig.cloudinaryConfig);
app.use(cors());

// db connection
const mongoose = require('mongoose');
const db =
  'mongodb+srv://admin:admin@cluster0-cflw6.mongodb.net/test?retryWrites=true&w=majority';
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};
mongoose.connect(db, options, err => {
  if (err) {
    console.error('Datebase ERROR!: ' + err);
  } else {
    console.log('Database connection sucessful');
  }
});

// storing image received from client to the ram
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

app.get('/', (req, res) => {
  res.send('ok');
});

app.post('/uploadImage', multerUploads, (req, res) => {
  if (req.file) {
    console.log('Uploading image...');
    const duri = new Datauri();
    const file = duri.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;
    cloudinaryConfig.uploader
      .upload(file)
      .then(result => {
        const image = result.url;
        console.log('IMAGE-URL: ' + image + 'Image Upload Successful!');
        res.send({ image });
      })
      .catch(err => {
        console.log(err);
        res.status(401).send(err);
      });
  }
});

const Team = require('./models/team');

app.get('/teams', (req, res) => {
  Team.find((err, teams) => {
    if (err) {
      res.status(501).send(err);
    } else {
      res.status(200).json(teams);
    }
  });
});

app.post('/uploadTeam', (req, res) => {
  const team = new Team(req.body);
  team.save((err, team) => {
    if (err) {
      res.status(501).send(err);
      console.log(err);
    } else {
      res.status(200).json(team);
      console.log(team);
    }
  });
});

app.listen(PORT, () => {
  console.log('Server listening at http://localhost:8080/');
});

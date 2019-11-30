const express = require('express');
const sqlite = require('sqlite');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), { Promise })

const port = process.env.PORT || 3333;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (request, response) => {
  const db = await dbConnection
  const formations = await db.all('select * from formation;')
  const experiences = await db.all('select * from experience;')
  const activities = await db.all('select * from activity;')
  const skills = await db.all('select * from abiliity;')
  const languages = await db.all('select * from language;')
  response.render('home', {
    formations,
    experiences,
    activities,
    skills,
    languages
  });
});

const init = async () => {
  const db = await dbConnection
  await db.run('create table if not exists formation (id INTEGER PRIMARY KEY, course TEXT, start TEXT, end TEXT, institution TEXT);')
  await db.run('create table if not exists experience (id INTEGER PRIMARY KEY, office TEXT, company TEXT, activities TEXT, period TEXT);')
  await db.run('create table if not exists activity (id INTEGER PRIMARY KEY, title TEXT, institution TEXT, description TEXT, period TEXT);')
  await db.run('create table if not exists abiliity (id INTEGER PRIMARY KEY, name TEXT, level TEXT);')
  await db.run('create table if not exists language (id INTEGER PRIMARY KEY, name TEXT, level TEXT, complement TEXT);')
}

init();

app.listen(port, (error) => {
  if(error) {
    console.log('Error starting server');
  } else {
    console.log('Server start on port 3333')
  }
});
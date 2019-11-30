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
  await db.run(`insert into formation(id, course, start, end, institution) values(1, 'Técnico em Redes de computadores', '2012', '2014', 'Escola Estadual de Educação Profissional Otília Correia Saraiva')`)
  await db.run(`insert into formation(id, course, start, end, institution) values(2, 'Bacharel em Sistemas de informações', '2015', '2018', 'Faculdade de Juazeiro do Norte')`)
  await db.run(`insert into experience(id, office, company, activities, period) values(1, 'Estagiário de TI', 'Free Life - Centro de especialidades Cariri', 
  'Gerência geral da rede interna. Manutenção de computadores e equipamentos de rede e impressoras.', '6 meses')`)
  await db.run(`insert into experience(id, office, company, activities, period) values(2, 'Desenvolvedor WEB', 'Devsmart', 
  'Desenvolvimento de aplicações web utilizando as seguintes tecnologias: HTML5, CSS3, Javascript, Wordpress, Laravel, MySQL', '9 meses')`)
  await db.run(`insert into experience(id, office, company, activities, period) values(3, 'Desenvolvedor ReactJS Júnior', 'Vnda Ecommerce', 
  'Desenvolvedor ReactJS utilizando as seguintes tecnologias: ReactJS, NextJS, Material UI, Typescript, Elasticsearch', '3 meses')`)
  await db.run(`insert into activity(id, title, institution, description, period) values(1, 'Semana da integração', 'Faculdade de Juazeiro do Norte', 'Ministrante de curso', '2018')`)
  await db.run(`insert into activity(id, title, institution, description, period) values(2, 'Semana de iniciação científica', 'Faculdade de Juazeiro do Norte', 'Apresentação na modalidade oral', '2018')`)
  await db.run(`insert into abiliity(id, name, level) values(1, 'Adobe photoshop', 'Básico')`)
  await db.run(`insert into abiliity(id, name, level) values(2, 'Adobe XD', 'Intermediário')`)
  await db.run(`insert into abiliity(id, name, level) values(3, 'Adobe Illustrator', 'Básico')`)
  await db.run(`insert into language(id, name, level, complement) values(1, 'Inglês', 'Básico', 'leitura, escrita, conversação')`)
  await db.run(`insert into language(id, name, level, complement) values(2, 'Espanhol', 'Básico', 'leitura, escrita, conversação')`)
}

init();

app.listen(port, (error) => {
  if(error) {
    console.log('Error starting server');
  } else {
    console.log('Server start on port 3333')
  }
});
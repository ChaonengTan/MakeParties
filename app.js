// Initialize express
const express = require('express')
const app = express()

// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// method override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// other requires/imports
const models = require('./db/models');
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// Use "main" as our default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');

// Routes

// OUR MOCK ARRAY OF PROJECTS
var events = [
    { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
    { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
    { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" }
]

// INDEX
app.get('/events', (req, res) => {
    // res.render('events-index', { events: events });
    console.log(req.body);
})
app.get('/events/new', (req, res) => {
    res.render('events-new', {});
})

// CREATE
app.post('/events', (req, res) => {
    models.Event.create(req.body).then(event => {
      res.redirect(`/events/${event.id}`);
    }).catch((err) => {
      console.log(err)
    });
  })

// SHOW
app.get('/events/:id', (req, res) => {
    models.Event.findByPk(req.params.id, { include: [{ model: models.Rsvp }] }).then(event => {
        res.render('events-show', { event: event });
    }).catch((err) => {
        console.log(err.message);
    })
  })
// EDIT
app.get('/events/:id/edit', (req, res) => {
    models.Event.findByPk(req.params.id).then((event) => {
      res.render('events-edit', { event: event });
    }).catch((err) => {
      console.log(err.message);
    })
  });
// UPDATE
app.put('/events/:id', (req, res) => {
    models.Event.findByPk(req.params.id).then(event => {
      event.update(req.body).then(event => {
        res.redirect(`/events/${req.params.id}`);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  });
// DELETE
app.delete('/events/:id', (req, res) => {
    models.Event.findByPk(req.params.id).then(event => {
      event.destroy();
      res.redirect(`/`);
    }).catch((err) => {
      console.log(err);
    });
  })
// CREATE
app.post('/events/:eventId/rsvps', (req, res) => {
    req.body.EventId = req.params.eventId;
    models.Rsvp.create(req.body).then(rsvp => {
      res.redirect(`/events/${req.params.eventId}`);
    }).catch((err) => {
        console.log(err)
    });
});

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
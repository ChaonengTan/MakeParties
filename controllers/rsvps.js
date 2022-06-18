// controllers/rsvps.js

module.exports = (app, models) => {
    // NEW
    app.get('/events/:eventId/rsvps/new', (req, res) => {
      models.Event.findByPk(req.params.eventId).then(event => {
        res.render('rsvps-new', { event: event });
      });
    });
  
    // CREATE
  
    // DESTROY  
  }
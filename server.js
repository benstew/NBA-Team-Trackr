var express = require('express'),
    //path = require('path'),
    compression = require('compression'),
    teams = require('./server/teams'),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(compression());

app.use('/', express.static(__dirname + '/www'));

app.get('/teams', teams.findAll);
app.get('/teams/:id', teams.findById);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

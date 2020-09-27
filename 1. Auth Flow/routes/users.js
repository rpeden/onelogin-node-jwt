var request = require('request');
var FormData = require('form-data');
var axios = require('axios');
var express = require('express');
var router = express.Router();

/*
  ALL OF THE ROUTES IN THIS PAGE REQUIRE AN AUTHENTICATED USER
*/

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log(req.user)

  res.render('users', {
    title: 'Users',
    user: req.user
  });
});

/* GET the profile of the current authenticated user */
router.get('/profile', function(req, res, next) {
  request.get(
    `https://${ process.env.SUBDOMAIN }.onelogin.com/oidc/2/me`,   
    {
    'auth': {
      'bearer': req.session.accessToken,
    }
  },function(err, respose, body){

    console.log('User Info')
    console.log(body);

    res.render('profile', {
      title: 'Profile',
      user: JSON.parse(body),
      rawUser: JSON.stringify(body, 2),
      rawToken: JSON.stringify(req.session.accessToken)
    });

  });
});

router.get('/token', async function(req, res, next) {
  request.post(
    `https://${ process.env.SUBDOMAIN }.onelogin.com/oidc/2/token/introspection`,   
    {
    'form': {
      'token': req.session.accessToken,
      'token_type_hint': 'access_token',
      'client_id': process.env.OIDC_CLIENT_ID,
      'client_secret': process.env.OIDC_CLIENT_SECRET
    }
  },function(err, response, body){
    res.render('token', {
      rawToken: JSON.stringify(body, 2)
    });
  });

});

module.exports = router;

var express = require('express');
var router = express.Router();
var usuarioModel = require.main.require('./models/usuarioModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/', (req, res)=>{
    res.render('login.ejs', {errs: []});
});

router.post('/', (req, res)=>{

    var data = {
        email: req.body.email,
        password: req.body.password
    };

    var rules = validationRules.usuarios.login;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=>{
        if(!errors){
            usuarioModel.validataUser(req.body.email, req.body.password, function(result){
                if(!result){
                  res.render('login', {errs: [{message: 'Email ou senha inválidos'}]});
                }
                else{
                  console.log(result);
                  if(result.is_admin == 1){
                      req.session.admin = result.usuario_id;
                      res.redirect('/admin/home');
                  }
                  else{
                      req.session.usuario = result.usuario_id;
                      res.redirect('/usuario/home');
                  }
                }
            });
        }
        else {
            console.log(fields);
            res.render('login', {errs: errors});
        }
    });

});

module.exports = router;

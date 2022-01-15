var express = require('express');
var router = express.Router();
var usuarioModel = require.main.require('./models/usuarioModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/', (req, res)=>{
    res.render('cadastro.ejs', {errs: []});
});

router.post('/', (req, res)=>{

    var data = {
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      curso: req.body.curso,
      password: req.body.password,
      genero: req.body.genero
    };

    var rules = validationRules.usuarios.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=>{
        if(!errors){
            usuarioModel.createUser(data, function(result){
                if(result){
                    console.log(result);
                    res.redirect('/login');
                }
                else {
                    res.send('Inválido');
                }
            });
        }
        else {
            console.log(fields);
            res.render('cadastro', {errs: errors});
        }
    });

});

module.exports = router;

var express = require('express');
var router = express.Router();
var usuarioModel = require.main.require('./models/usuarioModel');
var livroModel = require.main.require('./models/livroModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/home', (req, res)=> {
    usuarioModel.totallivrosEmprestadoByusuario(req.session.usuario, (livrosEmprestado)=> {
        if(!livrosEmprestado){
            res.send("Inválido");
        }
        else {
            res.render('usuario/home', {tbbbc: livrosEmprestado.length});
        }
    });
});

router.get('/perfil', (req, res)=> {
    var usuario = usuarioModel.getUser(req.session.usuario, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/perfil', {res: result});
        }
    });
});

router.get('/perfil/edit', (req, res)=> {
    var usuario = usuarioModel.getUser(req.session.usuario, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/perfil-edit', {res: result, errs: []});
        }
    });
});

router.post('/perfil/edit', (req, res)=> {
    var rules = validationRules.usuarios.updata;
    var validator = new asyncValidator(rules);
    var data = {
      user_id: req.body.usuario_id,
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      curso: req.body.curso,
      genero: req.body.genero
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            usuarioModel.updataUser(data, (result)=> {
                if(!result){
                    res.send('Inválido');
                }
                else {
                    res.redirect('/usuario/perfil');
                }
            });
        }
        else {
            console.log(fields);
            res.render('usuario/perfil-edit', {errs: errors, res: []});
        }
    });
});

router.get('/alterarpass', (req, res)=> {
    var usuario = usuarioModel.getUser(req.session.usuario, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/alterar-senha', {res: result, errs: [], success: []});
        }
    });
});

router.post('/alterarpass', (req, res)=> {
    var rules = validationRules.usuarios.alterarPassword;
    var validator = new asyncValidator(rules);
    var data = {
      senhaAntiga: req.body.senhaAntiga,
     novaSenha: req.body.novaSenha,
      confirmarSenha: req.body.confirmarSenha
    };

    if(req.body.password == req.body.senhaAntiga){
        validator.validate(data, (errors, fields)=> {
            if(!errors){
                if(req.body.novaSenha == req.body.confirmarSenha){
                    usuarioModel.updataPassword(req.body.novaSenha, req.body.usuario_id, (result)=> {
                        if(!result){
                            res.send('Inválido');
                        }
                        else {
                            res.render('usuario/alterar-senha', {errs:[], res: [], success: [{message: "Password alterard successfully"}]});
                        }
                    });
                }
                else {
                    res.render('usuario/alterar-senha', {errs:[{message: "Your new passwords don't match!"}], res: [], success: []});
                }
            }
            else {
                console.log(fields);
                res.render('usuario/alterar-senha', {errs: errors, res: [], success: []});
            }
        });
    }
    else {
        res.render('usuario/alterar-senha', {errs: [{message: "Your old passsword does not match!"}], res: [], success: []});
    }

});

router.get('/livros', (req, res)=> {
    livroModel.getUnemprestadolivros((result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/livros', {res: result, errs: []});
        }
    });
});

router.post('/livros', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    livroModel.usuarioSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('usuario/livros', {res: [], errs: [{message: "Nenhum resultado encontrado"}]});
        }
        else {
            console.log(result);
            res.render('usuario/livros', {res: result, errs: []})
        }
    });
});


router.get('/livros/emprestado', (req, res)=> {
    usuarioModel.getUserEmprestado(req.session.usuario, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/emprestado-livros', {res: result});
        }
    });
});

router.get('/livros/solicitado', (req, res)=> {
    res.render('usuario/livros-solicitado', {errs: [], success: []});
});

router.post('/livros/solicitado', (req, res)=> {
    var data = {
        genero: req.body.genero,
        titulo: req.body.titulo,
        autor: req.body.autor,
        edicao: req.body.edicao,
        isbn: req.body.isbn
    };

    var rules = validationRules.livros.solicitado;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            livroModel.livroRequest(req.session.usuario, data, (result)=> {
                if(result.length == 0){
                    res.send("Inválido");
                }
                else {
                    res.render('usuario/livros-solicitado', {errs: [], success: [{message: "Your solicitado has been noted, thank you!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('usuario/livros-solicitado', {errs: errors, success: []});
        }
    });
});
router.get('/livros/historico', (req, res)=> {
    usuarioModel.getUserHistory(req.session.usuario, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('usuario/historico', {res: result});
        }
    });
});



module.exports = router;

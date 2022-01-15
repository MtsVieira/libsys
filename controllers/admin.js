var express = require('express');
var router = express.Router();
var usuarioModel = require.main.require('./models/usuarioModel');
var livroModel = require.main.require('./models/livroModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/home', (req, res)=> {
    // var usuarios = "";
    usuarioModel.getAll((usuarios)=> {
        if(!usuarios){
            res.send("Inválido");
        }
        else {
            livroModel.getAll((livros)=> {
                if(!livros){
                    res.send("Inválido");
                }
                else {
                    livroModel.getAllEmprestadolivros((emprestado)=> {
                        if(!emprestado){
                            res.send("Inválido");
                        }
                        else {
                            livroModel.totalEmprestado30((maisEmprestado)=> {
                                if(!maisEmprestado){
                                    res.send("Inválido");
                                }
                                else {
                                    livroModel.maisSolicitadoLivro((maisSolicitado)=> {
                                        if(!maisSolicitado){
                                            res.render("Inválido");
                                        }
                                        else {
                                            livroModel.maisEmprestadoLivro((maisEmprestadoLivro)=> {
                                                if(!maisEmprestadoLivro){
                                                    res.send("Nenhum livro emprestado");
                                                }
                                                else {
                                                    res.render('admin/home', {usr: usuarios.length, bk: livros.length, brwd: emprestado.length, mb: maisEmprestado.length, mrb: maisSolicitado, mbb: maisEmprestadoLivro});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });


});

router.get('/perfil', (req, res)=> {
    var admin = usuarioModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/perfil', {res: result});
        }
    });
});

router.get('/perfil/edit', (req, res)=> {
    var admin = usuarioModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/perfil-edit', {res: result, errs: []});
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
                    res.redirect('/admin/perfil');
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/perfil-edit', {errs: errors, res: []});
        }
    });
});

router.get('/alterarpass', (req, res)=> {
    var admin = usuarioModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/alterar-senha', {res: result, errs: [], success: []});
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
                            res.render('admin/alterar-senha', {errs:[], res: [], success: [{message: "Password alterard successfully"}]});
                        }
                    });
                }
                else {
                    res.render('admin/alterar-senha', {errs:[{message: "Your new passwords don't match!"}], res: [], success: []});
                }
            }
            else {
                console.log(fields);
                res.render('admin/alterar-senha', {errs: errors, res: [], success: []});
            }
        });
    }
    else {
        res.render('admin/alterar-senha', {errs: [{message: "Your old passsword does not match!"}], res: [], success: []});
    }

});

router.get('/livros', (req, res)=> {
    livroModel.getAll((result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/livros', {res: result, errs: []});
        }
    });
});

router.post('/livros', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    livroModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/livros', {res: [], errs: [{message: "Nenhum resultado encontrado"}]});
        }
        else {
            console.log(result);
            res.render('admin/livros', {res: result, errs: []})
        }
    });
});

router.get('/usuarios', (req, res)=> {
    usuarioModel.getAll((result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/usuarios', {res: result, errs: []});
        }
    });
});

router.post('/usuarios', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    usuarioModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/usuarios', {res: [], errs: [{message: "Nenhum resultado encontrado"}]});
        }
        else {
            console.log(result);
            res.render('admin/usuarios', {res: result, errs: []})
        }
    });
});

router.get('/usuarios/add', (req, res)=> {
    res.render('admin/usuarios-add', {errs: [], success: [], data: []});
});

router.post('/usuarios/add', (req, res)=> {
    var data = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        password: req.body.password,
        curso: req.body.curso,
        genero: req.body.genero
    };

    var rules = validationRules.usuarios.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            usuarioModel.createUser(data, (result)=> {
                if(!result){
                    res.send("Inválido");
                }
                else {
                    console.log(result);
                    res.render('admin/usuarios-add', {errs: [], success: [{message: "usuario added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/usuarios-add', {errs: errors, success: [], data});
        }
    });
});

router.get('/livros/add', (req, res)=> {
    res.render('admin/livros-add', {errs: [], success: [], data: []});
});

router.post('/livros/add', (req, res)=> {
    var data = {
        genero: req.body.genero,
        titulo: req.body.titulo,
        autor: req.body.autor,
        editora: req.body.editora,
        edicao: req.body.edicao,
        isbn: req.body.isbn,
        paginas: req.body.paginas
    };

    var rules = validationRules.livros.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            livroModel.createLivro(data, (result)=> {
                if(!result){
                    res.send("Inválido");
                }
                else {
                    console.log(result);
                    res.render('admin/livros-add', {errs: [], success: [{message: "Livro added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/livros-add', {errs: errors, success: [], data});
        }
    });
});

router.get('/livros/edit/:id', (req, res)=> {
    var livro = req.params.id;
    livroModel.getLivro(livro, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            res.render('admin/livros-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/livros/edit/:id', (req, res)=> {
    var data = {
        genero: req.body.genero,
        titulo: req.body.titulo,
        autor: req.body.autor,
        editora: req.body.editora,
        edicao: req.body.edicao,
        isbn: req.body.isbn,
        paginas: req.body.paginas
    };
    var livro_id = req.body.livro_id;

    var rules = validationRules.livros.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            livroModel.updataLivro(livro_id, data, (result)=> {
                if(!result){
                    res.send("Inválido");
                }
                else {
                    console.log(result);
                    res.render('admin/livros-edit', {res: result, errs:[], success: [{message: "Livro updatad successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/livros-edit', {res: data, errs: errors, success: []})
        }
    });

});

router.get('/usuarios/edit/:id', (req, res)=> {
    var usuario = req.params.id;
    usuarioModel.getUser(usuario, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            res.render('admin/usuarios-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/usuarios/edit/:id', (req, res)=> {
    var data = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        password: req.body.password,
        curso: req.body.curso,
        genero: req.body.genero
    };
    var usuario_id = req.body.usuario_id;

    var rules = validationRules.usuarios.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            usuarioModel.updatausuario(usuario_id, data, (result)=> {
                if(!result){
                    res.send("Inválido");
                }
                else {
                    console.log(result);
                    res.render('admin/usuarios-edit', {res: result, errs:[], success: [{message: "usuario updatad successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/usuarios-edit', {res: data, errs: errors, success: []});
        }
    });

});

router.get('/usuarios/perfil/:id', (req, res)=> {
    var id = req.params.id;
    var usuario = usuarioModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/usuarios-perfil', {res: result});
        }
    });
});

router.get('/usuarios/delete/:id', (req, res)=> {
    var id = req.params.id;
    var usuario = usuarioModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/usuarios-delete', {res: result});
        }
    });
});

router.post('/usuarios/delete/:id', (req, res)=> {
    var id = req.body.usuario_id;
    var usuario = usuarioModel.deleteUser(id, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.redirect('/admin/usuarios');
        }
    });
});

router.get('/livros/delete/:id', (req, res)=> {
    var id = req.params.id;
    var livro = livroModel.getLivro(id, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/livros-delete', {res: result});
        }
    });
});

router.post('/livros/delete/:id', (req, res)=> {
    var id = req.body.livro_id;
    var livro = livroModel.deleteLivro(id, (result)=> {
        if(result.length == 0){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.redirect('/admin/livros');
        }
    });
});

router.get('/livros/:id/issue', (req, res)=> {
    usuarioModel.getAll((result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/livros-issue', {res: result, errs: [], success: []});
        }
    });
});

router.post('/livros/:id/issue', (req, res)=> {
    var livro_id = req.params.id;
    var usuario_id = req.body.usuario_id;

    livroModel.livrosIssuedByusuario(usuario_id, (livros)=> {
        if(!livros){
            res.send("Inválido");
        }
        else {
            console.log(livros.length);
            if(livros.length <= 2){
                livroModel.setIssuedata(livro_id, usuario_id, (result)=> {
                    if(!result){
                        res.send("Inválido");
                    }
                    else {
                        console.log(result);
                    }
                });
                livroModel.issueLivro(livro_id, usuario_id, (result)=> {
                    if(!result){
                        res.send("Inválido");
                    }
                    else {
                        console.log(result);
                        res.redirect('/admin/livros');
                    }
                });
            }
            else{
                usuarioModel.getAll((result)=> {
                    if(!result){
                        res.send("Inválido");
                    }
                    else {
                        console.log(result);
                        res.render('admin/livros-issue', {res: result, errs: [{message: "This usuario has already issued 3 livros, please unissue one first!"}], success: []});
                    }
                });
            }
        }
    });
});

router.get('/livros/issued', (req, res)=> {
    livroModel.getAll((result)=> {
        if(!result){
            res.send("Invalid!");
        }
        else {
            console.log(result);
            res.render('admin/issued-livros', {res: result});
        }
    });
});

router.post('/livros/issued', (req, res)=> {
    var livro_id = req.body.livro_id;
    livroModel.unissueLivro(livro_id, (result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.redirect('/admin/livros');
        }
    });
});

router.get('/livros/solicitados', (req, res)=> {
    livroModel.getSolicitadolivros((result)=> {
        if(!result){
            res.send("Inválido");
        }
        else {
            console.log(result);
            res.render('admin/livros-solicitados', {res: result, errs: []});
        }
    });
});

router.post('/livros/solicitados', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    livroModel.livroRequestSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/livros-solicitados', {res: [], errs: [{message: "Nenhum resultado encontrado"}]});
        }
        else {
            console.log(result);
            res.render('admin/livros-solicitados', {res: result, errs: []})
        }
    });
});



module.exports = router;

module.exports = {
    usuarios: {
        create: {
            nome: {
                required: true,
                message: 'Nome não pode ser vazio'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Email inválido'
            },
            telefone: {
                required: true,
                len: 11,
                message: 'Telefone inválido'
            },
            password: {
                required: true,
                min: 4,
                message: 'Invalid Password'
            },
            curso: {
                required: true,
                message: 'Curso inválido'
            },
            genero: {
                required: true,
                message: 'Selecione um gênero'
            }
        },
        updata: {
            nome: {
                required: true,
                message: 'Nome não pode ser vazio'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Email inválido'
            },
            telefone: {
                required: true,
                len: 11,
                message: 'Telefone inválido'
            },
            curso: {
                required: true,
                message: 'Curso inválido'
            },
            genero: {
                required: true,
                message: 'Selecione um gênero'
            }
        },
        login: {
            email: {
                required: true,
                type: 'email',
                message: 'Email inválido'
            },
            password: {
                required: true,
                message: 'Senha não pode ser vazio'
            }
        },
        alterarPassword: {
            senhaAntiga: {
                required: true,
                min: 4,
                message: 'Senha antiga inválida'
            },
           novaSenha: {
                required: true,
                min: 4,
                message: 'Nova senha inválida'
            },
            confirmarSenha: {
                required: true,
                min: 4,
                message: 'A senhas devem ser iguais'
            }
        }
    },

    livros: {
        create: {
            genero: {
                required: true,
                message: 'genero não pode ser vazio'
            },
            titulo: {
                required: true,
                message: 'titulo não pode ser vazio'
            },
            editora: {
                required: true,
                message: 'editora não pode ser vazio'
            },
            autor: {
                required: true,
                message: 'autor não pode ser vazio'
            },
            edicao: {
                required: true,
                message: 'Invalid edicao'
            },
            isbn: {
                required: true,
                message: 'ISBN não pode ser vazio'
            },
            paginas: {
                required: true,
                message: 'Invalid paginas'
            }
        },
        solicitado: {
            genero: {
                required: true,
                message: 'genero não pode ser vazio'
            },
            titulo: {
                required: true,
                message: 'titulo não pode ser vazio'
            },
            autor: {
                required: true,
                message: 'autor não pode ser vazio'
            },
            edicao: {
                required: true,
                message: 'Invalid edicao'
            },
            isbn: {
                required: true,
                message: 'ISBN não pode ser vazio'
            }
        }
    }
};

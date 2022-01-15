var db = require.main.require('./models/config');

//var db = um dois tres teste

var validataUser = (email, password, callback) => {
    var sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
    db.executeQuery(sql, [email, password], function(result) {
        callback(result[0]);
    });
};

var createUser = (user, callback) => {
    var sql = "INSERT INTO usuarios VALUES(null, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [user.nome, user.telefone, user.email, 0, user.password, user.curso, user.genero], function(result) {
        callback(result);
    });
};

var getUser = (id, callback) => {
    var sql = "SELECT * FROM usuarios WHERE user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updataUser = (user, callback) => {
    var sql = "UPdata usuarios SET name = ?, email = ?, phone = ?, curso = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [user.nome, user.email, user.telefone, user.curso, user.genero, user.usuario_id], function(result) {
        callback(result);
    });
};

var updataPassword = (password, id, callback) => {
    var sql = "UPdata usuarios SET password = ? WHERE user_id = ?";
    db.executeQuery(sql, [password, id], function(result) {
        callback(result);
    });
};

var getAll = (callback) => {
    var sql = "SELECT * FROM usuarios";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM usuarios WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var updatausuario = (id, usuario, callback) => {
    var sql = "UPdata usuarios SET name = ?, email = ?, phone = ?, curso = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [usuario.nome, usuario.email, usuario.telefone, usuario.curso, usuario.genero, id], function(result) {
        callback(result);
    });
};

var deleteUser = (id, callback) => {
    var sql = "DELETE FROM usuarios WHERE user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};
var getUserEmprestado = (id, callback) => {
    var sql = "SELECT * FROM livros WHERE user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};
var getUserHistory = (id, callback) => {
    var sql = "SELECT data_emissao.usuario_id, data_emissao.livro_id, livros.titulo, livros.autor, livros.editora, livros.edicao, livros.isbn, data_emissao.data FROM data_emissao INNER JOIN livros ON data_emissao.livro_id=livros.livro_id WHERE data_emissao.usuario_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var totallivrosEmprestadoByusuario = (id, callback) => {
    var sql = "SELECT livros.*, data_emissao.livro_id FROM data_emissao INNER JOIN livros ON data_emissao.livro_id=livros.livro_id WHERE data_emissao.usuario_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};


module.exports = {
    validataUser,
    createUser,
    getUser,
    updataUser,
    updataPassword,
    getAll,
    searchBy,
    updatausuario,
    deleteUser,
    getUserEmprestado,
    getUserHistory,
    totallivrosEmprestadoByusuario
};

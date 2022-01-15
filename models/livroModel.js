var db = require.main.require('./models/config');

var getAll = (callback) => {
    var sql = "SELECT * FROM livros";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM livros WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var createLivro = (livro, callback) => {
    var data = new data();
    var sql = "INSERT INTO livros VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [0, livro.genero, livro.titulo, livro.autor, livro.editora, livro.edicao, livro.isbn, livro.paginas, data], function(result) {
        callback(result);
    });
};

var getLivro = (id, callback) => {
    var sql = "SELECT * FROM livros WHERE livro_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updataLivro = (id, livro, callback) => {
    var sql = "UPdata livros SET genero = ?, titulo = ?, autor = ?, editora = ?, edicao = ?, isbn = ?, paginas = ? WHERE livro_id = ?";
    db.executeQuery(sql, [livro.genero, livro.titulo, livro.autor, livro.editora, livro.edicao, livro.isbn, livro.paginas, id], function(result) {
        callback(result);
    });
};

var deleteLivro = (id, callback) => {
    var sql = "DELETE FROM livros WHERE livro_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var issueLivro = (livro_id, usuario_id, callback) => {
    var data = new data();
    var sql = "UPdata livros SET user_id = ?, data_issued = ? WHERE livro_id = ?";
    db.executeQuery(sql, [usuario_id, data, livro_id], function(result) {
        callback(result);
    });
};

var unissueLivro = (livro_id, callback) => {
    var sql = "UPdata livros SET user_id = '', data_issued = '' WHERE livro_id = ?";
    db.executeQuery(sql, [livro_id], function(result) {
        callback(result);
    });
};

var getIssuedlivros = (id, callback) => {
    var sql = "SELECT * FROM livros WHERE NOT user_id = ''";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var getUnemprestadolivros = (callback) => {
    var sql = "SELECT * FROM livros WHERE (user_id = 'NULL') OR (user_id = 0)";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var livroRequest = (usuario_id, livro, callback) => {
    var data = new data();
    var sql = "INSERT INTO livros_request VALUES(null, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [usuario_id, livro.genero, livro.titulo, livro.autor, livro.edicao, livro.isbn, data], function(result) {
        callback(result);
    });
};

var usuarioSearch = (searchBy, word, callback) => {
    var sql = "(SELECT * FROM livros WHERE "+searchBy+" = ?) AND ((user_id = '') OR (user_id = 0))";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var getSolicitadolivros = (callback) => {
    var sql = "SELECT * FROM livros_request";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var livroRequestSearch = (searchBy, word, callback) => {
    var sql = "SELECT * FROM livros_request WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var setIssuedata = (livro_id, usuario_id, callback) => {
    var data = new data();
    var sql = "INSERT INTO data_emissao VALUES(null, ?, ?, ?)";
    db.executeQuery(sql, [livro_id, usuario_id, data], function(result) {
        callback(result);
    });
};

var livrosIssuedByusuario = (usuario_id, callback) => {
    var sql = "SELECT * FROM livros WHERE user_id = ?";
    db.executeQuery(sql, [usuario_id], function(result) {
        callback(result);
    });
};

var getAllEmprestadolivros = (callback) => {
    var sql = "SELECT * FROM data_emissao";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var totalEmprestado30 = (callback) => {
    var result = new data();
    var newdata = result.setdata(result.getdata() + 30);
    var sql = "SELECT livros.*, data_emissao.livro_id FROM data_emissao INNER JOIN livros ON data_emissao.livro_id=livros.livro_id WHERE (data BETWEEN ? AND ?)";
    db.executeQuery(sql, [newdata, result], function(result) {
        callback(result);
    });
};

var maisEmprestadoLivro = (callback) => {
    var sql = "SELECT livros.*, data_emissao.livro_id, COUNT(*) AS magnitude FROM data_emissao INNER JOIN livros ON data_emissao.livro_id=livros.livro_id GROUP BY livros.isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

var maisSolicitadoLivro = (callback) => {
    var sql = "SELECT *, COUNT(*) AS magnitude FROM livros_request GROUP BY isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

// SELECT livros.*, data_emissao.livro_id, COUNT(*) AS magnitude FROM data_emissao INNER JOIN livros ON data_emissao.livro_id=livros.livro_id WHERE (data BETWEEN '2018-07-10' AND '2018-08-10') GROUP BY livros.isbn ORDER BY magnitude DESC LIMIT 1


module.exports = {
    getAll,
    searchBy,
    createLivro,
    getLivro,
    updataLivro,
    deleteLivro,
    issueLivro,
    unissueLivro,
    getIssuedlivros,
    getUnemprestadolivros,
    livroRequest,
    usuarioSearch,
    getSolicitadolivros,
    livroRequestSearch,
    setIssuedata,
    livrosIssuedByusuario,
    getAllEmprestadolivros,
    totalEmprestado30,
    maisSolicitadoLivro,
    maisEmprestadoLivro
};

function notFoundPage(req, res, next) {
    // forziano il code di risposta corretto
    res.status(404)
    //   gestiamo l'errore andando a dare una risposta un pò più articolata
    res.json({
        error: "Not Found",
        message: "Pagina non trovata"
    });
};

module.exports = notFoundPage;
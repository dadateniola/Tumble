const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
        if(req?.session?.preRender) delete req.session.preRender;
        next();
    } else {
        if (req.session.preRender) {
            let videoType = req.session.preRender;
            req.session.preRender = {condition: true, videoType};
            req.session.form = req.body
            req.session.formError = errors.mapped()
            res.redirect('back');
        } else {
            req.session.form = req.body
            req.session.formError = errors.mapped()
            res.redirect('back');
        }
    }
}
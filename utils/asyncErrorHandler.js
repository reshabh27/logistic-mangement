


module.exports = (func) => {
    return (req, res, next) => {
        func(req, res).catch(err => next(console.log(err)))
    }
}
module.exports = func => {
    return (req, res, next) => {
        func().catch(next)
    }
}
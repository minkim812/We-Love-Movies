const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const data = await moviesService.list(req.query.is_showing);
    res.json({ data })
}

async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await moviesService.read(movieId);
    if(movie) {
        res.locals.movie = movie;
        return next();
    }
   next({ status: 404, message: `Movie cannot be found.` })
}

function read(req, res) {
    const { movie } = res.locals;
    res.json({ data: movie })
}

async function readTheaters(req, res) {
    const { movieId } = req.params;
    const theaters = await moviesService.readTheaters(movieId);
    res.json({ data: theaters })  
}

async function readReviews(req, res) {
    const { movieId } = req.params;
    const reviews = await moviesService.readReviews(movieId);
    res.json({ data: reviews })
}

module.exports = {
    
    read: [asyncErrorBoundary(movieExists), read],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
    list: asyncErrorBoundary(list),

};

const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties");

function list(is_showing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .where({ is_showing: true })
      .groupBy("m.movie_id")
      .orderBy("m.movie_id");
  } 
  
function read(movie_id) {
    return knex("movies").select("*").where({movie_id}).first();
}

function readTheaters(movie_id) {
    return knex("theaters")
      .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
      .select("*")
      .where("movie_id", movie_id)
}

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function readReviews(movieId) {
    console.log("read")
    return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("*")
      .where({"movie_id":movieId})
      .then((data) => {
          return (data.map(addCritic));
      })
}

module.exports = {
    list,
    read,
    readTheaters,
    readReviews,
};
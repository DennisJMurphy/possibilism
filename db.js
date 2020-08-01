const spicedPg = require("spiced-pg");
//const db = spicedPg("postgres:postgres:postgres@localhost:5432/caper-petition");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/caper-socialmedia"
);

module.exports.registerUser = (first, last, email, password) => {
    let q =
        "INSERT INTO users (first,last,email,password) VALUES ($1,$2,$3,$4) RETURNING id"; // values are a security measure
    // params are only needed if a query takes arguments
    let params = [first, last, email, password];
    return db.query(q, params);
};
module.exports.getPass = (email) => {
    //console.log("email in the getPass", email);
    let q = "SELECT id, password FROM users WHERE email=$1";
    return db.query(q, [email]);
};
module.exports.getId = (email) => {
    //console.log("email in the getPass", email);
    let q = "SELECT id FROM users WHERE email=$1";
    return db.query(q, [email]);
};

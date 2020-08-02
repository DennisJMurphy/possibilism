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
    let params = [email];
    return db.query(q, params);
};
module.exports.setCode = (email, code) => {
    //console.log("email in the getPass", email);
    let q = "INSERT into password_reset_codes (email,code) VALUES ($1,$2)";
    return db.query(q, [email, code]);
};
module.exports.getCode = () => {
    let q =
        "SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP -created_at < INTERVAL '2 minutes'";
    return db.query(q);
};
module.exports.updatePass = (email, password) => {
    let q = "UPDATE users SET password = $2 WHERE email = $1";
    return db.query(q, [email, password]);
};

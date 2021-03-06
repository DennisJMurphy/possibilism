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
    let q = "SELECT id FROM users WHERE email=$1";
    let params = [email];
    return db.query(q, params);
};
module.exports.setCode = (email, code) => {
    let q = "INSERT into password_reset_codes (email,code) VALUES ($1,$2)";
    return db.query(q, [email, code]);
};
module.exports.getCode = () => {
    let q =
        "SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP -created_at < INTERVAL '5 minutes'";
    return db.query(q);
};
module.exports.updatePass = (email, password) => {
    let q = "UPDATE users SET password = $2 WHERE email = $1";
    return db.query(q, [email, password]);
};
module.exports.userData = (userId) => {
    let q = "SELECT * FROM users WHERE id = $1";
    return db.query(q, [userId]);
};
module.exports.otherUser = (otherUser) => {
    let q = "SELECT first,last,email,bio,profile_pic FROM users WHERE id = $1";
    return db.query(q, [otherUser]);
};
module.exports.updateImage = (userId, url) => {
    let q =
        "UPDATE users SET profile_pic = $2 where id = $1 RETURNING profile_pic";
    return db.query(q, [userId, url]);
};
module.exports.updateBio = (userId, bio) => {
    let q = "UPDATE users SET bio = $2 where id = $1 RETURNING bio";
    return db.query(q, [userId, bio]);
};
module.exports.newUsers = () => {
    let q = "SELECT * FROM users ORDER BY id DESC LIMIT 3";
    return db.query(q);
};
module.exports.searchUsers = (userInput) => {
    let params = [`${userInput}%`];
    let q = "SELECT * FROM users WHERE first ILIKE $1 ORDER BY first LIMIT 3 ";
    //console.log("params", params);
    return db.query(q, params);
};
module.exports.checkFriend = (otherId, userId) => {
    let q =
        "SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)";
    return db.query(q, [otherId, userId]);
};
module.exports.request = (userId, otherId) => {
    let q = "INSERT INTO friendships (sender_id, recipient_id) VALUES ($1,$2)";
    return db.query(q, [userId, otherId]);
};
module.exports.addFriend = (userId, otherId) => {
    let q =
        "UPDATE friendships SET accepted='true' WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)";
    return db.query(q, [otherId, userId]);
};
module.exports.removeRow = (userId, otherId) => {
    let q =
        "DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)";
    return db.query(q, [otherId, userId]);
};
module.exports.getFrenebies = (userId) => {
    const q = `
    SELECT users.id, first, last, profile_pic, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  `;
    return db.query(q, [userId]);
};
module.exports.addChatMessage = (chatMessage, userId) => {
    const q = "INSERT INTO chat_messages (message, sender_id) VALUES ($1,$2)";
    return db.query(q, [chatMessage, userId]);
};
module.exports.getChatMessages = () => {
    const q = `
    SELECT * 
    FROM chat_messages 
    JOIN users 
    ON sender_id = users.id 
    ORDER BY chat_messages.id 
    DESC LIMIT 10 
    `;
    return db.query(q);
};
module.exports.getChatMessage = () => {
    const q = `
    SELECT * 
    FROM chat_messages 
    JOIN users 
    ON sender_id = users.id 
    ORDER BY chat_messages.id 
    DESC LIMIT 1
    `;
    return db.query(q);
};
module.exports.removeUserFriends = (userId) => {
    let q =
        "DELETE FROM friendships WHERE (recipient_id = $1) OR (sender_id = $1)";
    return db.query(q, [userId]);
};
module.exports.removeUserChats = (userId) => {
    let q = "DELETE FROM chat_messages WHERE sender_id = $1";
    return db.query(q, [userId]);
};
module.exports.removeUser = (userId) => {
    let q = "DELETE FROM users WHERE id = $1";
    return db.query(q, [userId]);
};
module.exports.addProjectInfo = (
    owner,
    name,
    category,
    summary,
    primary_metric,
    primary_metric_desc,
    resources
) => {
    let q =
        "INSERT INTO projects (owner, name, category, summary, primary_metric, primary_metric_desc,resources) VALUES ($1,$2,$3,$4,$5,$6,$7)";
    return db.query(q, [
        owner,
        name,
        category,
        summary,
        primary_metric,
        primary_metric_desc,
        resources,
    ]);
};
module.exports.currentProjects = () => {
    let q = `SELECT users.first, users.last, projects.id, projects.name, projects.category, projects.summary, projects.primary_metric, projects.primary_metric_desc, projects.resources
            FROM projects
            JOIN users
            ON users.id = projects.owner
            ORDER BY projects.id`;
    return db.query(q);
};
module.exports.updateField = (project, data) => {
    //console.log("db items", project, data);
    let q =
        "UPDATE projects SET primary_metric = (COALESCE(primary_metric,0) + COALESCE($2,0)) WHERE id = $1";
    return db.query(q, [project, data]);
};
module.exports.trackUsers = (user, project, amount) => {
    let q =
        "INSERT INTO updates (user_id, project_id, amount) VALUES ($1,$2,$3)";
    return db.query(q, [user, project, amount]);
};
module.exports.userStats = (user) => {
    let q = `SELECT updates.amount, updates.ts, projects.name, projects.primary_metric_desc
    FROM updates
    JOIN projects
    ON updates.project_id = projects.id 
    WHERE user_id = $1`;
    return db.query(q, [user]);
};
module.exports.userProjects = (userId) => {
    let q = "SELECT * FROM projects WHERE owner = $1";
    return db.query(q, [userId]);
};

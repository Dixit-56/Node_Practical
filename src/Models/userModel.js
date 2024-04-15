class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static getByUsername(username, callback) {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (error, results) => {
        if (error) {
          console.error(error);
          return callback(error, null);
        }
        if (results.length === 0) {
          return callback(null, null);
        }
        const userData = results[0];
        const user = new User(
          userData.username,
          userData.email,
          userData.password
        );
        callback(null, user);
      }
    );
  }

  save(callback) {
    db.query("INSERT INTO users SET ?", this, (error, result) => {
      if (error) {
        console.error(error);
        return callback(error);
      }
      callback(null);
    });
  }

  static getByUsernameAndPassword(username, password, callback) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (error, results) => {
        if (error) {
          console.error(error);
          return callback(error, null);
        }
        if (results.length === 0) {
          return callback(null, null);
        }
        const userData = results[0];
        const user = new User(
          userData.username,
          userData.email,
          userData.password
        );
        callback(null, user);
      }
    );
  }
}

module.exports = User;

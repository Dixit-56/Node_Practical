const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConnect = require("../Config/database");
const StatusCode = require("../Services/commonFunctions");

// Register user Api.
const registerUser = (req, res) => {
  const userData = req.body;
  const { username, email, password } = userData;

  // Validate user input
  if (!username || !email || !password) {
    return StatusCode.sendBadRequestResponse(res, "All fields are required");
  }

  // Check if the user already exists
  dbConnect.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, rows) => {
      if (error) {
        return StatusCode.InternalErrorResponse(res, "Internal Server Error");
      }

      if (rows.length > 0) {
        return StatusCode.conflictWithClient(res, "User already exists");
      }

      // Hash the password
      bcrypt.hash(password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          return StatusCode.InternalErrorResponse(res, "Internal Server Error");
        }

        // Insert the user data into the database
        dbConnect.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (insertError, result) => {
            if (insertError) {
              return StatusCode.InternalErrorResponse(
                res,
                "Internal Server Error"
              );
            }

            const insertedUserId = result.insertId;

            // Generate JWT token with user ID
            const token = jwt.sign(
              { id: insertedUserId, email },
              process.env.SECRET_KEY
            );

            // Update the user's token in the database
            dbConnect.query(
              "UPDATE users SET token = ? WHERE id = ?",
              [token, insertedUserId],
              (updateError) => {
                if (updateError) {
                  console.error("Database update error:", updateError);
                  return StatusCode.InternalErrorResponse(
                    res,
                    "Internal Server Error"
                  );
                }

                // Retrieve the inserted user's data
                dbConnect.query(
                  "SELECT * FROM users WHERE id = ?",
                  [insertedUserId],
                  (err, rows) => {
                    if (err) {
                      console.error("Database select error:", err);
                      return StatusCode.InternalErrorResponse(
                        res,
                        "Internal Server Error"
                      );
                    }
                    // Send the inserted user's data in the response
                    StatusCode.sendSuccessResponse(
                      res,
                      "User registered successfully",
                      rows[0],
                      token
                    );
                  }
                );
              }
            );
          }
        );
      });
    }
  );
};

// Login user Api.
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return StatusCode.sendBadRequestResponse(
      res,
      "Email and password are required"
    );
  }

  // Check if the user exists
  dbConnect.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, rows) => {
      if (error) {
        return StatusCode.InternalErrorResponse(res, "Internal Server Error");
      }

      if (rows.length === 0) {
        return StatusCode.sendUnauthorizedResponse(res, "Invalid credentials");
      }

      const user = rows[0];
      // Compare passwords
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err, "error");
          return StatusCode.InternalErrorResponse(res, "Internal Server Error");
        }

        if (!result) {
          return StatusCode.sendUnauthorizedResponse(
            res,
            "Invalid credentials"
          );
        }
        const insertedUserId = user.id;

        // Passwords match, generate JWT token
        const token = jwt.sign(
          { id: insertedUserId, email: user.email },
          process.env.SECRET_KEY
        );

        // Send token in response
        StatusCode.sendSuccessResponse(res, "Login successful", token);
      });
    }
  );
};

module.exports = userController = {
  registerUser,
  login,
};

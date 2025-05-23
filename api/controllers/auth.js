import User from "../models/user.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
 
  User.login(email)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        if (rows[0].password === password) {
          const { password: excludedPass, ...userDetails } = rows[0];
          req.session.isLoggedIn = true;
          req.session.user = rows[0].username;
          res.status(200).json({
            status: "success",
            description: "Login successful",
            user: userDetails,
          });
        } else {
          res.status(200).json({
            status: "failure",
            description: "Invalid Username or Password",
          });
        }
      } else {
        res.status(200).json({
          status: "failure",
          description: "Invalid Username or Password",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const signup = async (req, res, next) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const dateOfBirth = req.body.dateOfBirth;

  const user = new User(
    username,
    firstName,
    lastName,
    email,
    password,
    dateOfBirth
  );
  user
    .save()
    .then(() => {
      req.session.isLoggedIn = true;
      req.session.user = username;
      res.status(201).json({
        status: "success",
        description: "User has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res
      .status(200)
      .json({ status: "success", description: "Logout successful" });
  });
};

export const forgetPassword = (req, res) => {
  const { password, email } = req.body;
  User.resetPassword(email, password)
    .then(([rows, fieldData]) => {
      if (rows.affectedRows > 0) {
        res.status(200).json({
          status: "success",
          description: "Password successfully updated",
        });
      } else {
        res.status(200).json({
          status: "failure",
          description: "Email not found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

import User from "../models/user.js";

export const getUsers = async (req, res) => {
  User.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getUser = async (req, res) => {
  const email = req.params.email;
  User.fetchUser(email)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        res.status(200).json({ status: "success", user: rows[0] });
      } else {
        res
          .status(200)
          .json({ status: "failure", description: "User Does not exists" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ status: "failure", description: error });
    });
};

export const addUser = async (req, res) => {
  const username = req.body.username;
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const dateOfPermit = req.body.dateOfPermit;
  const dateOfBirth = req.body.dateOfBirth;

  const user = new User(
    username,
    fullName,
    email,
    password,
    dateOfPermit,
    dateOfBirth
  );
  user
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "User has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error.message })
    );
};

export const deleteUser = async (req, res) => {};
export const updateUser = async (req, res) => {
  const { email } = req.params;
  console.log(req.body);
  const { name, password } = req.body;

  const updatedData = { name, password };

  User.updateUser(email, updatedData)
    .then(([result, fieldData]) => {
      if (result.affectedRows > 0) {
        res.status(200).json({
          status: "success",
          description: "User updated successfully",
        });
      } else {
        res.status(200).json({
          status: "failure",
          description: "User not found",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        status: "failure",
        description: error.message || "Failed to update user",
      });
    });
};

export const checkEmail = async (req, res) => {
  const email = req.query.email;
  User.checkEmail(email)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        res.status(200).json({ status: "success", exists: true });
      } else {
        res.status(200).json({ status: "success", exists: false });
      }
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};
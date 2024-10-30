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

export const getUser = async (req, res) => {};

export const addUser = async (req, res) => {
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
      res.status(201).json({
        status: "success",
        description: "User has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const deleteUser = async (req, res) => {};
export const updateUser = async (req, res) => {};
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

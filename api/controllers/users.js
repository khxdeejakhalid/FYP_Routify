import InstructorLearner from "../models/instructor_learner.js";
import User from "../models/user.js";
import Checklist from "../models/checklist.js";
import { getChecklistItems } from "../util/constants.js";

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
  const role = req.body.role;
  const password = req.body.password;
  const dateOfPermit = req.body.dateOfPermit;
  const dateOfBirth = req.body.dateOfBirth;

  const user = new User(
    username,
    fullName,
    email,
    password,
    dateOfPermit,
    dateOfBirth,
    role
  );
  try {
    const createdUser = await user.save();

    if (role === "learner") {
      const [instructors] = await User.findUserByRole("instructor");

      // * Randomly assign an instructor
      const randomInstructor =
        instructors[Math.floor(Math.random() * instructors.length)];

      const instructorLearnerRelation = new InstructorLearner({
        instructorEmail: randomInstructor.email,
        learnerEmail: email,
      });

      await instructorLearnerRelation.save();

      const checkListItems = getChecklistItems(email);
      // Insert checklist Items for each new user.
      await Checklist.insertMany(checkListItems);
    }
    res.status(201).json({
      status: "success",
      description: "User has been added successfully",
      user: createdUser,
    });
  } catch (error) {
    console.log("🚀 ~ addUser ~ error:", error);
    res.status(400).json({ status: "failure", description: error.message });
  }
};

export const deleteUser = async (req, res) => {};
export const updateUser = async (req, res) => {
  const { email } = req.params;
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

export const fetchProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const [user] = await User.fetchUser(email);
    let userProfile = {
      ...user[0],
    };

    if (user[0].role === "instructor") {
      const [instructorLearnerRows] =
        await InstructorLearner.fetchAssignedLearners(email);
      userProfile.assignedLearners = instructorLearnerRows;
    } else {
      const [instructorLearnerRows] =
        await InstructorLearner.fetchAssignedInstructor(email);
      userProfile.assignedInstructor = instructorLearnerRows[0];
    }

    res.status(200).json({ status: "success", profile: userProfile });
  } catch (error) {
    res.status(400).json({ status: "failure", description: error });
  }
};

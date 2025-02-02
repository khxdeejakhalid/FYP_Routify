import TestCenter from "../models/test-center.js";

export const getTestCenters = async (req, res) => {
  TestCenter.fetchAll()
    .then(([rows, fieldData]) => {
      res.status(200).json({ status: "success", centers: rows });
    })
    .catch((error) => {
      res.status(400).json({ status: "failure", description: error });
    });
};

export const getTestCenter = async (req, res) => {};

export const addTestCenter = async (req, res) => {
  const name = req.body.name;
  const city = req.body.city;
  const country = req.body.country;

  if (!name || !city || !country) {
    return res.status(400).json({
      status: "failure",
      description: "Missing required fields: name, city, or country",
    });
  }
  
  const testCenter = new TestCenter(name, city, country);

  testCenter
    .save()
    .then(() => {
      res.status(201).json({
        status: "success",
        description: "testCenter has been added successfully",
      });
    })
    .catch((error) =>
      res.status(400).json({ status: "failure", description: error })
    );
};

export const deleteTestCenter = async (req, res) => {};
export const updateTestCenter = async (req, res) => {};

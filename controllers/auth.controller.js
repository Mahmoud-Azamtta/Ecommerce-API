import userModel from "../models/user.model.js";

export const login = async (req, res) => {
  console.log("reached");
  return res.json({ message: "login" });
};

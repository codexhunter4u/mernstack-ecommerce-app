import JWT from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";
import { comparePassword, hashPassword } from "../Helper/AuthHelper.js";

export const authRegister = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    console.log(req.body);

    // validators
    if (!name) {
      return res.send({
        message: "Name is required",
      });
    }

    if (!email) {
      return res.send({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.send({
        message: "Password is required",
      });
    }

    if (!phone) {
      return res.send({
        message: "Phone is required",
      });
    }

    if (!answer) {
      return res.send({
        message: "Answer is required",
      });
    }

    const userExist = await UserModel.findOne({ email });

    // Existing user
    if (userExist) {
      return res.status(200).send({
        success: true,
        message: "User is already registered with this email. Please login",
      });
    }

    //Password hash
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully !",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in resgistration",
      error: error,
    });
  }
};

// User Login
export const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user is exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    // CHeck the password is correct
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generte Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }

    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }

    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //Check user exist
    const user = await UserModel.findOne({ email, answer });

    //validate user
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// Update prfole
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await UserModel.findById(req.user._id);
    //password
    if (password && password.length < 5) {
      return res.status(200).send({
        success: false,
        message: "Passsword is required and 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

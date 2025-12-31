const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
const register = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // hard block admin registration
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "engineer" && (!skills || skills.length === 0)) {
      return res.status(400).json({
        message: "Engineers must provide skills",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills: role === "engineer" ? skills : [],
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



const login = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(req.body);

    if (!user) {
      return res.status(404).json({ error: `User with ${email} not found` });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }

};

module.exports = {
  register,
  login
}
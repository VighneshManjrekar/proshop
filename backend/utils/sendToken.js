import jwt from "jsonwebtoken";

const sendToken = (res, { _id, name, email, isAdmin }) => {
  const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // set JWT as HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json({ success: true, user: { _id, name, email, isAdmin } });
};

export default sendToken;

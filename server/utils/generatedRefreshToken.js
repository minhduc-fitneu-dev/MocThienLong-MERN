// utils/generatedRefreshToken.js
import jwt from "jsonwebtoken";

const generatedRefreshToken = async (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

export default generatedRefreshToken;

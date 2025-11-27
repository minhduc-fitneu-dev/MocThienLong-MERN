// utils/generatedAccessToken.js
import jwt from "jsonwebtoken";

const generatedAccessToken = async (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {
      expiresIn: "5h",
    }
  );
};

export default generatedAccessToken;

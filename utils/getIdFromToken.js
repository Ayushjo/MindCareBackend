import jwt from "jsonwebtoken";

export const getIdFromToken = (token) => {
  if (!token) {
    console.log("No token ");
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { id, email } = decodedToken;
      return id;
    } catch (error) {
      return null;
    }
  }
};

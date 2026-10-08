import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized..." });
    req.user = decode;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      success: false,
      message: "Error while authenticating.",
    });
  }
};

export default authenticate;

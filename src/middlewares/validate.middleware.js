const Validate = (schema) => {
  return (req, res, next) => {
    const value = schema.safeParse(req.body);

    if (!value.success) {
      res.status(403).json({
        success: false,
        message: "Invalid Details...",
        error: value.error.issues.map((err) => err.message),
      });
    }

    req.body = value.data;
    next();
  };
};

export default Validate;

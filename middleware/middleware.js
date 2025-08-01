export const verifyToken = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
  
      if (!authorization) {
        throw new Error("You are not authorized");
      }

      if (!authorization.startsWith("Bearer ")) {
        throw new Error("You are not authorized");
      }
  
      const token = authorization.split(" ")[1];
 
      if (process.env.JWT_TOKEN !== token) {
        throw new Error("You are not authorized");
      }
  
      next();
    } catch (err) {
      res.status(200).json({ success: "0", message: err.message });
    }
  };
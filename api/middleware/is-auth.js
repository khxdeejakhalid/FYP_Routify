export default (req, res, next) => {
  // TODO: will add jwt token authentication
  
  if (req.session) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Access denied: User is not authenticated" });
};

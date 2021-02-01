const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.send(req.user);
  /*
  res.json({
    posts: {
      title: "my first post",
      description: "random data not accessible",
    },
  });
  */
});

module.exports = router;
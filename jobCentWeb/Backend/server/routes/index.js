const sessionController = require("../controllers/").sessionController;
const usersController = require("../controllers").usersController;
const transfersController = require("../controllers").transfersController;

module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the jobCent API!"
    })
  );
  // create new user and send confirmation code email
  app.post("/api/users", usersController.create);
  // verify confirmation code and login user
  app.post("/api/session", sessionController.create);
  // get token balance and user data
  app.get("/api/users/:id", usersController.getOne);
  app.put("/api/users/:id", usersController.update);
  // logout user
  app.delete("/api/session", sessionController.destroy);
  // create new transfer
  app.post("/api/transfers", transfersController.create);
  // fetch transaction history for a given user
  app.get("/api/transfers/:id", transfersController.findAll);
  
};

const { connect } = require("../data_base");
const crypto = require("crypto");

let userController = {
  users: [],

  async saveUsers(client) {
    userController.users.push({
      login: client.employee.options.user,
      emp: client.employee,
      pos: client.empStatus.rows[0].grantee,
    });
  },

  findUser(login) {
    for (let i = 0; i < userController.users.length; i++) {
      if (login == userController.users[i].login) {
        return userController.users[i];
      }
    }
  },

  logoutUser(login) {
    for (let i = 0; i < userController.users.length; i++) {
      if (login == userController.users[i].login) {
        userController.users.splice(i, 1);
      }
    }
  },
  async userAuth(req, res) {
    const emp_password = crypto
        .createHash("sha512")
        .update(req.body.password)
        .digest("hex").toUpperCase();
    let user = await connect(req.body.login, emp_password);
    let client = { employee: user, empStatus: "" };
    client.empStatus = await client.employee.query(
      `SELECT grantee FROM information_schema.table_privileges LIMIT 1`
    );
    await userController.saveUsers(client);
    res.json({
      login: client.employee.options.user,
      position: client.empStatus.rows[0].grantee,
    });
  },
  async addEmp(req, res) {
    const current = userController.findUser(req.body.login);
    if (current.pos == "manager") {
      const emp_password = crypto
        .createHash("sha512")
        .update(req.body.emp_password)
        .digest("hex").toUpperCase();
      const { first_name, last_name, emp_position, emp_login } = req.body;
      const emp_address = req.body.emp_address;
      const p_serias = req.body.p_serias;
      const p_number = req.body.p_number;
      const dob = req.body.dob;
      await current.emp.query(
        `CALL create_emp($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          first_name,
          last_name,
          emp_position,
          emp_login,
          emp_password,
          emp_address,
          p_serias,
          p_number,
          dob,
        ]
      );
      res.json("employee have added");
    } else {
      res.json("error, wrong login");
    }
  },
  async empInf(req, res) {
    const current = userController.findUser(req.body.login);
    if (current.pos == "manager") {
      answer = await current.emp.query(`SELECT * FROM employee_inf`)
      res.json(answer.rows)
    } else {
      res.json("error, wrong login");
    }
  },
  async logOut(req, res) {
    const login = req.body.login;
    for (let i = 0; i < userController.users.length; i++) {
      if (login == userController.users[i].login) {
        userController.users.splice(i, 1);
      }
    }
    res.json("logout ok");
  },
};

module.exports = userController;

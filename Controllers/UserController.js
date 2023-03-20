const db = require('../database/database');

/***************************************
* function to register a regular user  *
****************************************/
const signUp = (req, res) => {
  const { username, password } = req.body
  const query = 'INSERT INTO usertest (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    console.log('Data inserted successfully');
    res.status(200).json({ success: true, message: 'success' });
  });
  
}

const getUser = (req, res) => {
  const username = req.params.username;
  const query = 'SELECT * FROM usertest WHERE username = ?'
  db.query(query, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json(results[0]);
  });
}

module.exports = { signUp, getUser };

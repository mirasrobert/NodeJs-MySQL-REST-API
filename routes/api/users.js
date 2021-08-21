const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Model
const Article = require('../../models/Article');
const User = require('../../models/User');

// Relationship -- One-To-Many relationship
User.hasMany(Article, { foreignKey: 'user_id' });
Article.belongsTo(User, { foreignKey: 'user_id'});

/*
 * @route 	/api/users
 * @method 	GET
 * @desc 	Get users
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({ users });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/users
 * @method 	POST
 * @desc 	Create a new User
 */
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

	// Validate
    if (!email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const newUser = {
      email,
      password,
    };

    // Encyrpt the password using bcrypt
    const salt = await bcrypt.genSalt(10);

    // Overwrite password from user object and encrypt
    newUser.password = await bcrypt.hash(password, salt);

    const user = await User.create(newUser); // Returns user and promise

    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/users/article/:id
 * @method 	GET
 * @desc 	Get user with article
 */
router.get('/article/:id', async (req, res) => {
  try {

    // Select all from user and join table articles
    const user = await User.findAll({
      include: [{ model: Article }],
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ msg: 'User does not exist' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

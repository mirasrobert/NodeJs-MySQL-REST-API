const express = require('express');
const router = express.Router();

// Model
const Article = require('../../models/Article');
const User = require('../../models/User');

// Relationship -- One-To-Many relationship
User.hasMany(Article, { foreignKey: 'user_id' });
Article.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

/*
 * @route 	/api/articles
 * @method 	GET
 * @desc 	Get all articles
 */
router.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll();

    res.json({ articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/articles
 * @method 	POST
 * @desc 	Add article
 */
router.post('/', async (req, res) => {
  try {
    const { title, body, user_id } = req.body;

    // Validate
    if (!title || !body || !user_id) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const newArticle = {
      user_id,
      title,
      body,
    };

    // Create article
    const article = await Article.create(newArticle); // Returns article and promise

    res.json({ article });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/articles/user/:id
 * @method 	GET
 * @desc 	Get all articles of specific user
 */
router.get('/user/:id', async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [{ model: User, as: 'user' }],
      where: { user_id: parseInt(req.params.id) },
    });

    if (!articles) {
      return res
        .status(404)
        .json({ msg: 'Article for that user does not exist' });
    }

    res.json({ articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/articles/:id
 * @method 	GET
 * @desc 	Get single article by id
 */
router.get('/:id', async (req, res) => {
  try {
    // Get all articles
    const articles = await Article.findAll({
      where: { id: parseInt(req.params.id) },
    });

    if (!articles || articles.length === 0) {
      return res.status(404).json({ msg: 'Article does not exist' });
    }

    res.json({ articles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/articles/:id
 * @method 	PUT
 * @desc 	Update single article by id
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, body } = req.body;

    const article = await Article.findOne({
      where: { id: parseInt(req.params.id) },
    });

    // Check if article exist
    if (!article) {
      return res.status(404).json({ msg: 'Article does not exist' });
    }

    const editArticle = {
      title,
      body,
    };

    // If title is not present then don't change
    if (!title) editArticle.title = article.title;

    // If body is not present then don't change
    if (!body) editArticle.body = article.body;

    // If article has been found then update it.
    await article.update(editArticle, {
      where: { id: parseInt(req.params.id) },
    });

    res.json({ article });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/*
 * @route 	/api/articles/:id
 * @method 	DELETE
 * @desc 	Delete single article by id
 */
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { id: parseInt(req.params.id) },
    });

    // Check if article exist
    if (!article) {
      return res.status(404).json({ msg: 'Article does not exist' });
    }

    // Delete by id
    await Article.destroy({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ msg: `Article id of ${req.params.id} has been removed.` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

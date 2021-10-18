const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  externalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER
  }
}, {
});

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
  },
  body: {
    type: DataTypes.TEXT
  }
}, {
});


Post.hasMany(Comment, { foreignKey: 'postId', sourceKey: 'id' });

//Post.sync({force: true});
//Comment.sync({force: true});

exports.Post = Post;
exports.Comment = Comment;
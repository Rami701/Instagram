// models/post.js

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      caption: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      img_url: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: 'post',
      timestamps: true
    });
  
    return Post;
  };
  
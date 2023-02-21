// models/comment.js

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      caption: {
        type: DataTypes.STRING(150),
        allowNull: false
      }
    }, {
      tableName: 'comment',
      timestamps: true
    });
  
    return Comment;
  };
  
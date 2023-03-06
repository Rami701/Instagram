// models/commentlike.js

module.exports = (sequelize, DataTypes) => {
    const CommentLike = sequelize.define('CommentLike', {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    }, {
      tableName: 'comment_like',
      timestamps: false
    });
  
    return CommentLike;
  };
  
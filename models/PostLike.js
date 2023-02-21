// models/postLike.js

module.exports = (sequelize, DataTypes) => {
    const PostLike = sequelize.define('PostLike', {
      post_id: {
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
      tableName: 'post_like',
      timestamps: false
    });
  
    return PostLike;
  };
  
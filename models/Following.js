// models/following.js

module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define('Following', {
      follower_id: {
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
      tableName: 'following',
      timestamps: false
    });
  
    return Following;
  };
  
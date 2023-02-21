// models/user.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true
      },
      img_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: 'users',
      timestamps: true
    });
  
    return User;
  };
  
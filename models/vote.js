module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define("Vote", {
          likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          dislikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          hasVoted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
          }
        });
  
    Vote.associate = function(models) {
      // We're saying that a Vote should belong to an Author
      // A Vote can't be created without an Author due to the foreign key constraint
      Vote.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        }
      });
  
  
    };

return Vote;

};
  
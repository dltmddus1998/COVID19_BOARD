const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    return sequelize.define(
        'GlobalStat',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED, // 양의 정수
                allowNull: false,
                primaryKey: true,
            },
            
        }
    )
}
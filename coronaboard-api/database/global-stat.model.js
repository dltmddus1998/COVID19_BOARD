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
            cc: { // country code
                type: DataTypes.CHAR(2),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            confirmed: { // 확진자 수
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            death: { // 사망자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            released: { // 완치자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            tested: { // 총 검사자 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            testing: { // 검사중 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            negative: { // 결과 음성 수
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,  // 시퀄라이즈 인스턴스
            tableName: 'GlobalStat',    // 데이터베이스에서 테이블명
            indexes: [  // 테이블 인덱스
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'id' }],
                },
                {
                    name: 'ccWithDate',
                    unique: true,
                    fields: [{ name: 'cc' }, { name: 'date' }],
                },
            ],
            timestamps: false, // 타임스탬프 속성 자동 생성 x
        },
    );
};
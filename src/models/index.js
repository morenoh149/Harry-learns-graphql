import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  { dialect: 'postgres', },
);

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
};

Object.values(models)
  .forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

export { sequelize };

export default models;

import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      return await models.Message.create({
        text,
        userId: me.id,
      });
    },
    updateMessage: async (parent, { id, text }, { models }) => {
      const result = await models.Message.update(
        { text },
        {
          where: { id },
          returning: true,
        }
      );
      let [count, affectedRows] = result;
      const updateRow = affectedRows[0].dataValues;
      return updateRow;
    },
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id }});
    }
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};

import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

/*
 * isAuthenticated a resolver middleware that handles Authentication API wide.
 */
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

/*
 * isAdmin returns if the current request is by an administrator.
 */
export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role }}) =>
    role === 'ADMIN'
    ? skip
    : new ForbiddenError('Not authorized as admin.'),
);

/*
 * isMessageOwner returns if the current request is by the message owner.
 */
export const isMessageOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const message = await models.Message.findById(id, { raw: true });

  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

module.exports = {
  publishCommand: ({ defaultCommand }) => `${defaultCommand} --access public`,
  monorepo: {
    mainVersionFile: 'lerna.json',
    packagesToBump: ['packages/*'],
    packagesToPublish: ['packages/*'],
  },
};

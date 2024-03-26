module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'nuber-eats-backendd',
      url: 'http://127.0.0.1:4000/graphql',
    },
  },
}

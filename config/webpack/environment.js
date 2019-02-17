const { environment } = require('@rails/webpacker')

environment.config.set('output.library', [ 'Packs', '[name]' ])
environment.config.set('output.libraryTarget', 'var')

module.exports = environment

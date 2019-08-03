'use strict'

const App = require('./app')
const defaults = require('./defaults')

exports.plugin = {
    pkg: require('../package.json'),
    defaults,
    alias: 'deadlock:mqtt',
    async register (container, options) {
        if (!options.enabled) {
            return
        }
        const log = container.resolvePlugin('logger')

        new App(options).listen()
        log.info('MQTT is up and running')
    },
}

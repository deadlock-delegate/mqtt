'use strict'

const mqtt = require('mqtt')
const { app } = require('@arkecosystem/core-container')

const VALID_EVENTS = [
    'block.applied', 'block.forged', 'block.reverted', 'delegate.registered', 'delegate.resigned',
    'forger.failed', 'forger.missing', 'forger.started', 'peer.added', 'peer.removed',
    'transaction.applied', 'transaction.expired', 'transaction.forged', 'transaction.reverted',
    'wallet.vote', 'wallet.unvote', 'transaction.pool.added', 'transaction.pool.rejected',
    'transaction.pool.removed'
]

class App {
    constructor (options) {
        const log = app.resolvePlugin('logger')
        const emitter = app.resolvePlugin('event-emitter')

        const mqttBroker = options.mqttBroker
        const client = mqtt.connect(mqttBroker)
        client.on('connect', () => log.info(`Connected to broker at ${mqttBroker}`))
        client.on('disconnect', () => log.warning(`Received disconnect packets from broker`))
        client.on('reconnect', () => log.info(`Reconnecting to broker`))
        client.on('error', (err) => log.error(err))

        this.mqttClient = client
        this.log = log
        this.emitter = emitter
        this.options = options
    }

    listen () {
        const subscribedToEvent = []
        for (const event of this.options.events) {
            if (!VALID_EVENTS.includes(event)) {
                this.log.warning(`${event} is not a valid event!`)
                continue
            }

            if (subscribedToEvent.includes(event)) {
                continue
            }

            subscribedToEvent.push(event)
            this.subscribe(event)
        }
    }

    subscribe (event) {
        const context = {
            mqttClient: this.mqttClient,
            log: this.log,
            eventName: event,
            topic: this.options.topic
        }
        this.emitter.on(event, async function (data) {
            this.mqttClient.publish(
                this.topic,
                JSON.stringify({ event: this.eventName, data })
            )
        }.bind(context))
        this.log.info(`MQTT publisher is subscribe to ${event}`)
    }

    disconnect () {
        this.mqttClient.end()
    }
}

module.exports = App

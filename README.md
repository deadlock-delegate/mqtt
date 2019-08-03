# MQTT plugin for Ark Ecosystem

MQTT plugin that broadcasts events to an MQTT broker. At the moment this plugin only broadcasts but
might be extended with additional features as well as including an MQTT server so users won't have
to run a separate MQTT broker.

If you have any feature requests don't forget to open an Issue.

## Installation

#### For production:

`yarn global add @deadlock-delegate/mqtt`

#### For development:

You can run a development MQTT broker with this command if you have Docker installed:

`docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`

```bash
cd ~/ark-core/plugins
git clone https://github.com/deadlock-delegate/mqtt
cd .. && yarn setup
```

### Registration & configuration

Open `~/.config/ark-core/{mainnet|devnet|testnet}/plugins.js` and add `'@deadlock/mqtt": {},` to
the bottom of the config.

like so:

```js
module.exports = {
    ...
    "@arkecosystem/core-snapshots": {},
    "@deadlock-delegate/mqtt": {
        enabled: true,  // default is false, to set it to true if you wish to enable the plugin
        events: ['block.forged', 'block.applied', 'transaction.applied'],  // events you wish to subscribe to
        topic: 'ark/events',  // the topic you wish to publish messages to
        mqttBroker: 'mqtt://localhost:1883'  // location of your MQTT broker
    }
}
```

## Credits

- [roks0n](https://github.com/roks0n)
- [All Contributors](../../contributors)

## License

[MIT](LICENSE) © roks0n

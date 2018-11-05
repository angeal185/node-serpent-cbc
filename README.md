# node-serpent-cbc
nodejs module for cbc encryption with the serpent cipher 

```js
const Serpent = require('serpent');

//encrypt
Serpent.encrypt(data, password, '256')

//decrypt
Serpent.decrypt(data, password, '256')

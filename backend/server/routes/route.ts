const express = require('express');
const router = express();
import {Controller} from '../controllers/controller';
const c = new Controller();

router.get('/get/:key', c.get);

router.get('/getAll', c.getAll);

router.post('/create', c.create);

router.put('/update/:key', c.update);

router.delete('/delete/:key', c.delete);

module.exports = router;
import {BTree} from '../../btree'
const btree = new BTree(2);
btree.loadFromFile();

export class Controller {

    get(req, res) {
        const key = parseInt(req.params.key);
        try{
            const keyValue = btree.findNode(key).keyValue.filter(t => t.key === key)[0];

            console.log(keyValue)
            res.json(keyValue);
        }catch(e) {
            console.log(e)
            res.json(null)
        }
    }

    getAll(_, res) {
        const data = btree.getAllRecords();

        res.json(data);
    }

    create(req, res) {
        const data = req.body;
        btree.insertNew(data.value);
        res.json(btree.getAllRecords())
    }

    update(req, res) {
        const key = parseInt(req.params.key);
        console.log(`Key: ${key}, data: ${req.body}`)
        try{
            btree.updateValue(key, req.body)

            res.json(btree.getAllRecords())
            return;
        }catch(e) {
            res.json(null);
        }
    }

    delete(req, res) {
        const key = parseInt(req.params.key);

        try{
            console.log(key)
            btree.delete(key);

            res.json(btree.getAllRecords())
        }catch(e) {
            console.log(e)
            res.json(null)
        }
    }
}

import {Node} from './Node';
import {BS, status} from './binarySearch';
import * as fs from "node:fs";

export class BTree {

    t: number;
    root: Node;
    private currentKey: number;

    constructor(t: number) {
        this.t = t;
        this.root = new Node(this.t);
        this.root.isLeaf = true;
        this.currentKey = 0;
    }

    public insertNew(value: {}): void {
        const newKeyValue = {key: this.currentKey, value};
        this.currentKey++;
        this.insert(newKeyValue);
    }

    private insert(keyValue: { key: number, value: {} }): void {

        let newNode: Node;
        const r = this.root;

        if (this.root.keysNumber === 2 * this.t - 1) {
            newNode = new Node(this.t);
            this.root = newNode;
            r.parent = newNode;
            newNode.child[0] = r;
            newNode.isLeaf = false;
            this.treeSplit(newNode, 0);
            this.insert_nonfull(this.root, keyValue);
        } else {
            this.insert_nonfull(r, keyValue);
        }
    }

    public saveToFile(filename: string): void {
        const data = this.root.toJSON();
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filename, jsonData);
        console.log(`Tree saved to ${filename}`);
    }

    public loadFromFile(): void {
        const data = fs.readFileSync('../btreeFiles/b-tree', 'utf-8');
        if (!data) {
            console.log(`No files loaded`);
            return;
        }
        this.root = JSON.parse(data);

        this.restoreParentReferences(this.root, null);
        console.log(`Tree loaded from b-tree`);
    }

    private restoreParentReferences(current: Node, parent: Node | null): void {
        current.parent = parent;

        for (let i = 0; i < current.keysNumber; i++) {
            if (current.keyValue[i].key > this.currentKey) {
                this.currentKey = current.keyValue[i].key + 1;
            }
        }

        for (let i = 0; i < current.keysNumber + 1; i++) {
            if (current.child[i]) {
                this.restoreParentReferences(current.child[i], current);
            }
        }
    }

    private treeSplit(current: Node, i: number): void {
        const a = current.child[i];
        const b = new Node(this.t);
        b.isLeaf = a.isLeaf;
        b.parent = current;
        b.keysNumber = this.t - 1;

        for (let i = 0; i < this.t - 1; i++) {
            b.keyValue[i] = a.keyValue[i + this.t];
        }

        if (!a.isLeaf) {
            for (let j = 0; j < this.t; j++) {
                b.child[j] = a.child[j + this.t];
                b.child[j].parent = b;
            }

            a.child.splice(this.t, a.child.length - this.t);
        }

        a.keysNumber = this.t - 1;

        for (let j = current.keysNumber; j >= i + 1; j--) {
            current.child[j + 1] = current.child[j];
        }

        current.child[i + 1] = b;

        for (let j = current.keysNumber - 1; j >= i; j--) {
            current.keyValue[j + 1] = current.keyValue[j];
        }

        current.keyValue[i] = a.keyValue[this.t - 1];
        a.keyValue.splice(this.t - 1);
        current.keysNumber++;
    }

    private insert_nonfull(current: Node, keyValue: { key: number, value: {} }): void {
        let i = current.keysNumber - 1;

        if (current.isLeaf) {
            while (i >= 0 && current.keyValue[i]?.key > keyValue.key || current.keyValue[i]?.key === keyValue.key) {
                if (current.keyValue[i].key === keyValue.key) {
                    throw new Error("You can not insert the same keys")
                }
                current.keyValue[i + 1] = current.keyValue[i];
                i--;
            }

            current.keyValue[i + 1] = keyValue;
            current.keysNumber++;
        } else {

            const result = BS(current.keyValue, keyValue.key);

            if (result.status === status.equal) {
                throw new Error("You can not insert the same keys")
            } else {
                i = result.index;
            }

            i++;

            if (current.child[i].keysNumber === 2 * this.t - 1) {
                this.treeSplit(current, i);

                if (keyValue.key > current.keyValue[i].key) {
                    i++;
                }
            }
            this.insert_nonfull(current.child[i], keyValue);
        }

    }

    public findNode(k: number): Node | null {
        return finding(this.root, k);

        function finding(cur: Node, k: number): Node {

            let result: { status: status, index: number };

            if (cur?.keyValue) {
                result = BS(cur.keyValue, k);
            } else {
                console.log("Field was not found")
                return null;
            }

            if (result.status === status.equal) {
                return cur;
            } else {
                return finding(cur.child[++result.index], k);
            }
        }
    }

    updateValue(key: number, newValue: {}): void {
        const node = this.findNode(key);

        if (!node) {
            throw new Error(`Node with key ${key} not found.`);
        }

        const index = node.keyValue.findIndex(kv => kv.key === key);

        if (index === -1) {
            throw new Error(`Key ${key} not found in the node.`);
        }

        node.keyValue[index].value = newValue;
        console.log(`Value for key ${key} updated successfully.`);
    }

    public delete(k: number): void {
        if (this.root.keysNumber === 0) {
            console.log("No elements deleted");
            return;
        }

        const node = this.findNode(k);

        if (node) {
            this.delete_element(node, k);
            console.log("Element deleted successfully");
            return;
        }

        throw new Error("No elements deleted")
    }

    private delete_element(cur: Node, k: number): void {
        let i: number;
        let j: number;
        let t: Node;

        if (!cur) {
            return;
        }

        if (cur === this.root && cur.isLeaf) {
            for (i = 0; i < cur.keysNumber; i++) {
                if (cur.keyValue[i].key === k) {
                    for (j = i; j < cur.keysNumber - 1; j++) {
                        cur.keyValue[i] = cur.keyValue[j + 1];
                    }

                    cur.keyValue.splice(cur.keysNumber - 1, 1);
                    cur.keysNumber--;
                    break;
                }
            }
        }

        if (cur.isLeaf) {
            for (i = 0; i < cur.keysNumber; i++) {
                if (cur.keyValue[i].key == k) {
                    for (j = i; j < cur.keysNumber - 1; j++) {
                        cur.keyValue[j] = cur.keyValue[j + 1];
                    }
                    cur.keyValue.splice(cur.keysNumber - 1, 1);
                    cur.keysNumber--;
                    break;
                }
            }

            if (cur.keysNumber < this.t - 1)
                this.fix_delete(cur);
        } else {
            for (i = 0; i < cur.keysNumber; i++) {
                if (cur.keyValue[i].key == k) {
                    t = cur.child[i];
                    while (!t.isLeaf) {
                        t = t.child[t.keysNumber];
                    }
                    cur.keyValue[i] = t.keyValue[t.keysNumber - 1];
                    this.delete_element(t, t.keyValue[t.keysNumber - 1].key);
                    return;
                }
            }

            for (i = 0; i < cur.keysNumber; i++) {
                if (k < cur.keyValue[i].key) {
                    this.delete_element(cur.child[i], k);
                    return;
                }
            }
            this.delete_element(cur.child[cur.keysNumber], k);
        }
    }

    private fix_delete(cur: Node): void {
        let parent: Node;
        let left: Node = null;
        let right: Node = null;
        let parent_index: number
        let i: number;

        if (cur === this.root) {
            if(cur.keysNumber === 0) {
                return;
            }
            if (cur.keysNumber >= 1) {
                return
            }

            this.root = cur.child[0];
            this.root.parent = null;
            cur = null;
            return;

        }

        parent = cur.parent;

        parent_index = -1;
        for (i = 0; i < parent.keysNumber + 1; i++) {
            if (parent.child[i] === cur) {
                parent_index = i;
                break;
            }
        }

        if (parent_index === -1)
            throw new Error("parent can not be -1");

        if (parent_index + 1 < parent.keysNumber + 1) {
            right = parent.child[parent_index + 1];
        }

        if (parent_index - 1 >= 0) {
            left = parent.child[parent_index - 1];
        }

        if (right && right.keysNumber >= this.t) {
            cur.keyValue[cur.keysNumber] = parent.keyValue[parent_index];
            cur.keysNumber++;

            if (!cur.isLeaf) {
                cur.child[cur.keysNumber] = right.child[0];
                cur.child[cur.keysNumber].parent = cur;
            }

            parent.keyValue[parent_index] = right.keyValue[0];

            for (i = 0; i < right.keysNumber - 1; i++) {
                right.keyValue[i] = right.keyValue[i + 1];
                right.child[i] = right.child[i + 1];
            }

            right.child[right.keysNumber - 1] = right.child[right.keysNumber];
            right.keyValue.splice(right.keysNumber - 1, 1);
            right.keysNumber--;

        } else if (left && left.keysNumber >= this.t) {
            cur.child[cur.keysNumber + 1] = cur.child[cur.keysNumber];
            for (let i = cur.keysNumber - 1; i >= 0; i--) {
                cur.keyValue[i + 1] = cur.keyValue[i];
                cur.child[i + 1] = cur.child[i];
            }
            cur.keyValue[0] = parent.keyValue[parent_index - 1];
            if (!cur.isLeaf) {
                cur.child[0] = left.child[left.keysNumber];
                cur.child[0].parent = cur;
            }
            cur.keysNumber++;

            parent.keyValue[parent_index - 1] = left.keyValue[left.keysNumber - 1];

            left.keyValue.splice(left.keysNumber - 1, 1);
            left.keysNumber--;
        } else {

            if (right) {
                cur.keyValue[cur.keysNumber] = parent.keyValue[parent_index];
                cur.keysNumber++;

                for (i = 0; i < right.keysNumber; i++) {
                    cur.keyValue[cur.keysNumber] = right.keyValue[i];
                    if (!cur.isLeaf) {
                        cur.child[cur.keysNumber] = right.child[i];
                        cur.child[cur.keysNumber].parent = cur;
                    }
                    cur.keysNumber++;
                }
                if (!cur.isLeaf) {
                    cur.child[cur.keysNumber] = right.child[right.keysNumber];
                    cur.child[cur.keysNumber].parent = cur;
                }

                right = null;

                for (i = parent_index; i < parent.keysNumber - 1; i++) {
                    parent.keyValue[i] = parent.keyValue[i + 1];
                    parent.child[i + 1] = parent.child[i + 2];
                }
                parent.keyValue.splice(parent.keysNumber - 1, 1);
                parent.keysNumber--;
            } else {
                left.keyValue[left.keysNumber] = parent.keyValue[parent_index - 1];
                left.keysNumber++;

                for (i = 0; i < cur.keysNumber; i++) {
                    left.keyValue[left.keysNumber] = cur.keyValue[i];
                    if (!cur.isLeaf) {
                        left.child[left.keysNumber] = cur.child[i];
                        left.child[left.keysNumber].parent = left;
                    }
                    left.keysNumber++;
                }
                if (!cur.isLeaf) {
                    left.child[left.keysNumber] = cur.child[cur.keysNumber];
                    left.child[left.keysNumber].parent = left;
                }

                cur = null;

                for (i = parent_index - 1; i < parent.keysNumber - 1; i++) {
                    parent.keyValue[i] = parent.keyValue[i + 1];
                    parent.child[i + 1] = parent.child[i + 2];
                }

                parent.keyValue.splice(parent.keysNumber - 1, 1);
                parent.keysNumber--;
            }

            if (parent.keysNumber < this.t - 1)
                this.fix_delete(parent);
        }
    }

    public getAllRecords(): Array<{ key: number, value: {} }> {
        const keys: Array<{ key: number, value: {} }> = [];
        this.traversal(this.root, keys);
        return keys;
    }

    private traversal(current: Node, keys: Array<{ key: number, value: {} }>): void {
        let i = 0;

        while (i < current.keysNumber) {
            if (!current.isLeaf) {
                this.traversal(current.child[i], keys);
            }

            keys.push(current.keyValue[i]);
            i++;
        }

        if (!current.isLeaf) {
            this.traversal(current.child[i], keys);
        }
    }
}

const btree = new BTree(2);

btree.insertNew({name: 'dawdaw'});

btree.delete(0);

console.log("h")

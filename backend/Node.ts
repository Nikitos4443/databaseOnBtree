export class Node {
    keysNumber: number;
    keyValue: Array<{key: number, value: {}}>
    child: Array<Node>;
    parent: Node | null;
    isLeaf: boolean;

    t: number;

    public constructor(t: number) {
        this.t = t;
        this.parent = null;
        this.keysNumber = 0;
        this.keyValue  = new Array<{key: number, value: {}}>;
        this.child = new Array<Node>;
        this.isLeaf = false;
    }

    toJSON() {
        const { parent, ...rest } = this;
        return rest;
    }
}
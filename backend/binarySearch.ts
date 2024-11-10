export enum status {
    equal,
    notEqual
}

type returning = {
    status: status,
    index: number
} | undefined

export const BS = (keys: Array<{key: number, value: {}}>, k: number): returning => {
    let low = 0;
    let high = keys.length - 1;

    if(k > keys[high].key) {
        return {status: status.notEqual, index: keys.length - 1}
    } else if(k < keys[low].key) {
        return {status: status.notEqual, index: -1}
    } else if(k === keys[low].key) {
        return {status: status.equal, index: low};
    } else if(k === keys[high].key) {
        return {status: status.equal, index: high};
    }

    while(low <= high) {
        const mid = Math.floor((low + high) / 2);
        const value = keys[mid];

        if(k > value.key && k < keys[mid+1].key) {
            return {status: status.notEqual, index: mid};
        }
        if(k === keys[mid].key) {
            return {status: status.equal, index: mid};
        }
        if(k > value.key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
}
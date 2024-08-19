export class QueryBuilder {
    private static processValue(value: number | string | boolean): string {
        return typeof value === 'number' ? value.toString() : typeof value === 'boolean' ? (value ? 'T' : 'F') : value === '' ? '' : `'${value}'`;
    }

    public static append(query: { $and: any[] } | { $or: any[] }, ...subQuery: any[]) {
        const array = '$and' in query ? query.$and : query.$or;

        array.push(...subQuery);

        return array;
    }

    public static appendIfTruthy(param: any, query: { $and: any[] } | { $or: any[] }, ...subQuery: any[]) {
        const array = '$and' in query ? query.$and : query.$or;

        if (!!param) {
            array.push(...subQuery);
        }

        return array;
    }

    public static and(...subQuery: any[]) {
        return { $and: subQuery };
    }

    public static or(...subQuery: any[]) {
        return { $or: subQuery };
    }

    public static equal(field: string, value: string | string[] | number | number[] | boolean | boolean[]) {
        if (Array.isArray(value)) {
            value = `[${(value as any[]).map(this.processValue).join(',')}]`;
        } else {
            value = this.processValue(value);
        }

        return { [field]: { op: ':', value } };
    }

    public static notEqual(field: string, value: string | string[] | number | number[] | boolean | boolean[]) {
        if (Array.isArray(value)) {
            value = `[${(value as any[]).map(this.processValue).join(',')}]`;
        } else {
            value = this.processValue(value);
        }

        return { [field]: { op: '!', value } };
    }

    public static greaterThan(field: string, rawValue: string | number) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '>', value } };
    }

    public static greaterThanOrEqual(field: string, rawValue: string | number) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '>=', value } };
    }

    public static lessThan(field: string, rawValue: string | number) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '<', value } };
    }

    public static lessThanOrEqual(field: string, rawValue: string | number) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '<=', value } };
    }

    public static like(field: string, rawValue: string) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '~', value } };
    }

    public static at(field: string, rawValue: number) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '@', value } };
    }

    public static caseInsensitiveLike(field: string, rawValue: string) {
        const value = this.processValue(rawValue);
        return { [field]: { op: '~>', value } };
    }

    public static stringify(query: any) {
        const deconstruct = (obj: any) => {
            const key = Object.keys(obj)[0];

            return { key, value: obj[key] };
        };

        const serialize = (q: any, combinator = ';') => {
            // q is query, but named differently to avoid shadowed variable

            const res = q
                .map((subquery: any) => {
                    const { key, value } = deconstruct(subquery);

                    switch (key) {
                        case '$or':
                            return serialize(value, ',');
                        case '$and':
                            return serialize(value, ';');
                        default:
                            return `${key}${value.op}${value.value}`;
                    }
                })
                .join(combinator);

            return `(${res})`;
        };

        return serialize([query]);
    }

    public static prepareQueryValue(value: string, contains: boolean = false) {
        return (contains ? `%${value}%` : `${value}%`) // 'contains' or 'startsWith' search
            .replace(/\//g, '////') // escape '/' to '//'
            .replace(/%+/, '%') // remove multiple '%'
            .replace(/_/g, '/_') // escape '_' to '/_'
            .replace(/\/\//g, '/') // remove multiple '/'
            .toUpperCase();
    }
}

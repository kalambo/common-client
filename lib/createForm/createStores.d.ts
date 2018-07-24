declare const _default: () => {
    rgo: {
        get(keys: [string, string, string], emit: (value: any[] | null) => void): () => void;
        set(values: {
            key: [string, string, string];
            value: any;
        }[]): void;
    };
    local: {
        get(keys: string[], emit: (value: any[]) => void): () => void;
        set(values: {
            key: string;
            value: any;
        }[]): void;
    };
};
export default _default;

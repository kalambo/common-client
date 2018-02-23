declare const _default: {
    parseFilter: (filter: string, type: string) => any;
    printFilter: (filter: any[] | null, type: string) => any;
    parseValue: (value: string, scalar: "string" | "boolean" | "json" | "date" | "int" | "float") => any;
    printValue: (value: any, scalar: "string" | "boolean" | "json" | "date" | "int" | "float") => string;
    fieldName: (field: any, type: any) => any;
};
export default _default;

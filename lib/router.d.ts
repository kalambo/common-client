/// <reference types="react" />
import r from 'refluent';
export declare const withLocation: r<{
    [key: string]: any;
    [key: number]: any;
}, {
    [key: string]: any;
    [key: number]: any;
}>;
export declare const getLocation: r<any, any>;
export declare const withBreadcrumbs: (base: any) => r<{
    [key: string]: any;
    [key: number]: any;
}, {
    [key: string]: any;
    [key: number]: any;
}>;
export declare const Route: ({ path, label, loader, component, render, ...routeProps }: any) => JSX.Element;
export declare const Breadcrumbs: r<any, any>;
export declare const Link: ({ to, newTab, route: _, ...props }: any) => JSX.Element;

/// <reference types="react" />
import * as React from 'react';
export declare const routerPure: (InnerComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any> | React.StatelessComponent<any>;
export declare const withRouter: (basename?: any) => (InnerComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any> | React.StatelessComponent<any>;
export declare const Route: ({ path, label, loader, component, render, ...routeProps }: any) => JSX.Element;
export declare const Breadcrumbs: React.ComponentClass<any> | React.StatelessComponent<any>;
export declare const Link: ({ to, newTab, route, ...props }: any) => JSX.Element;

/// <reference types="react" />
export { Link } from 'react-router-dom';
import * as React from 'react';
import { HOC } from 'mishmash';
export declare const routerPure: HOC<any, any>;
export declare const withRouter: (basename?: any) => HOC<any, any>;
export declare const Route: ({ path, label, loader, component, render, ...routeProps }: any) => JSX.Element;
export declare const Breadcrumbs: React.ComponentType<any>;

import * as React from 'react';
import {
  BrowserRouter,
  Link as RouterLink,
  Route as RouteBase,
  withRouter as withRouterBase,
} from 'react-router-dom';
import GatsbyLink from 'gatsby-link';
import {
  branch,
  compose,
  context,
  enclose,
  map,
  omit,
  pure,
  render,
  restyle,
  withHover,
  Wrap,
} from 'mishmash';
import { Div, Icon, Txt } from 'elmnt';
import st from 'style-transform';

import getData from './generic/getData';

export const routerPure = compose(withRouterBase, pure);

export const withRouter = (basename?) =>
  compose(
    render(({ next }) => (
      <BrowserRouter basename={basename}>{next()}</BrowserRouter>
    )),
    withRouterBase,
    enclose(({ setState }) => {
      const setBreadcrumb = (path: string, label: string) =>
        setState({ [path]: label });
      return ({ location, ...props }, labels) => ({
        ...props,
        breadcrumbs:
          location.pathname === '/'
            ? [['/', labels['/'] || '']]
            : location.pathname.split('/').map((path, i, paths) => {
                const current = paths.slice(0, i + 1).join('/');
                return [current || '/', labels[current || '/'] || path];
              }),
        setBreadcrumb,
      });
    }, {}),
    context('setBreadcrumb', ({ setBreadcrumb }) => setBreadcrumb),
    map(omit('setBreadcrumb', 'match', 'history')),
  );

const RouteComponent = compose(
  branch(
    ({ component }) => component,
    render(({ component: Comp, data, props }) => (
      <Comp data={data} {...props} />
    )),
  ),
)(({ render, data, props }) => render({ data, ...props }));

const Breadcrumb = compose(
  branch(
    ({ label }) => typeof label === 'function',
    map(({ label, ...props }) => ({
      ...props,
      label: label(props.match.params),
    })),
  ),
  branch(
    ({ label }) => Array.isArray(label),
    compose(
      getData(({ label }) => label[0]),
      map(({ label, ...props }) => ({
        ...props,
        label: props.data ? label[1](props.data) : '...',
      })),
    ),
  ),
  context('setBreadcrumb'),
  enclose(({ initialProps, onProps }) => {
    const update = ({ label, match, setBreadcrumb }) =>
      setBreadcrumb(match.url, label);
    update(initialProps);
    onProps(props => props && update(props));
    return props => props;
  }),
)(({ path, loader, component, render, routeProps, data }) => (
  <RouteBase
    path={path}
    {...routeProps}
    render={props =>
      !loader || data ? (
        <RouteComponent
          component={component}
          render={render}
          data={data}
          props={props}
        />
      ) : (
        loader
      )
    }
  />
));

export const Route = ({
  path,
  label,
  loader,
  component,
  render,
  ...routeProps
}: any) => (
  <div>
    <RouteBase
      path={path}
      render={({ match }) => (
        <Breadcrumb
          path={path}
          label={label}
          loader={loader}
          component={component}
          render={render}
          routeProps={routeProps}
          match={match}
        />
      )}
    />
  </div>
);

export const Breadcrumbs = map(
  restyle({
    base: null,
    link: [['mergeKeys', 'link']],
    icon: [['scale', { fontSize: 0.9 }]],
  }),
)(({ breadcrumbs, style }) => (
  <Div style={{ layout: 'bar', spacing: 10, paddingRight: 200 }}>
    {breadcrumbs.map(([path, label], i) => (
      <Div style={{ layout: 'bar', spacing: 10 }} key={i}>
        {i !== 0 && (
          <Icon
            viewBox="0 0 8 16"
            path="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"
            style={style.icon}
          />
        )}
        {i === breadcrumbs.length - 1 ? (
          <Txt style={style.base}>{label}</Txt>
        ) : (
          <RouterLink to={path}>
            <Wrap hoc={withHover}>
              {({ isHovered: hover, hoverProps }) => (
                <Txt
                  {...hoverProps}
                  style={st(style.link, [['mergeKeys', { hover }]])}
                >
                  {label}
                </Txt>
              )}
            </Wrap>
          </RouterLink>
        )}
      </Div>
    ))}
  </Div>
));

export const Link = ({ to, newTab, route, ...props }: any) => {
  const external = to.startsWith('http');
  const Comp = route ? RouterLink : GatsbyLink;
  return external ? (
    <a href={to} target="_blank" {...props} />
  ) : (
    <Comp to={to} {...(newTab ? { target: '_blank' } : {})} {...props} />
  );
};

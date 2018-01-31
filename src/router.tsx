export { Link } from 'react-router-dom';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  BrowserRouter,
  Link,
  Route as RouteBase,
  withRouter as withRouterBase,
} from 'react-router-dom';
import {
  branch,
  compose,
  getContext,
  pure,
  renderComponent,
  withContext,
  withProps,
} from 'recompose';
import {
  combineState,
  HOC,
  Hover,
  mapStyle,
  omitProps,
  renderLayer,
} from 'mishmash';
import { Div, Icon, Txt } from 'elmnt';

import getData from './getData';

export const routerPure = compose(withRouterBase, pure) as HOC;

export const withRouter = (basename?) =>
  compose<any, any>(
    renderLayer(({ children }) => (
      <BrowserRouter basename={basename}>{children}</BrowserRouter>
    )),
    withRouterBase,
    combineState(({ setState }) => {
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
    withContext(
      { setBreadcrumb: PropTypes.func },
      ({ setBreadcrumb }: any) => ({ setBreadcrumb }),
    ),
    omitProps('setBreadcrumb', 'match', 'history'),
  ) as HOC;

const RouteComponent = compose<any, any>(
  branch(
    ({ component }: any) => component,
    renderComponent(({ component: Comp, data, props }: any) => (
      <Comp data={data} {...props} />
    )),
  ),
)(({ render, data, props }) => render({ data, ...props }));

const Breadcrumb = compose<any, any>(
  branch(
    ({ label }: any) => typeof label === 'function',
    compose(
      withProps(({ label, match }: any) => ({ label: label(match.params) })),
    ),
  ),
  branch(
    ({ label }: any) => Array.isArray(label),
    compose(
      getData(({ label }) => label[0]),
      withProps(({ label, data }: any) => ({
        label: data ? label[1](data) : '...',
      })),
    ),
  ),
  getContext({ setBreadcrumb: PropTypes.func }),
  combineState(({ initialProps, onNextProps }) => {
    const update = ({ label, match, setBreadcrumb }: any) =>
      setBreadcrumb(match.url, label);
    update(initialProps);
    onNextProps(update);
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

export const Breadcrumbs = mapStyle({
  base: null,
  link: [['mergeKeys', 'link']],
  icon: [['scale', { fontSize: 0.9 }]],
})(({ breadcrumbs, style }) => (
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
          <Link to={path}>
            <Hover style={style.link}>
              <Txt>{label}</Txt>
            </Hover>
          </Link>
        )}
      </Div>
    ))}
  </Div>
));

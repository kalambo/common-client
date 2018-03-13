import * as React from 'react';
import {
  BrowserRouter,
  Link as RouterLink,
  Route as RouteBase,
  withRouter as withRouterBase,
} from 'react-router-dom';
import GatsbyLink from 'gatsby-link';
import m, { HOC } from 'mishmash';
import { Div, Hover, Icon, Txt } from 'elmnt';
import st from 'style-transform';

import getData from './generic/getData';

export const routerPure = m.do(withRouterBase).pure() as HOC;

export const withRouter = (basename?) =>
  m
    .yield(({ next }) => (
      <BrowserRouter basename={basename}>{next()}</BrowserRouter>
    ))
    .do(withRouterBase)
    .merge((props$, push) => {
      const labels = {};
      return {
        setBreadcrumb: (path, label) => {
          const { location } = props$();
          labels[path] = label;
          push({
            breadcrumbs:
              location.pathname === '/'
                ? [['/', labels['/'] || '']]
                : location.pathname.split('/').map((path, i, paths) => {
                    const current = paths.slice(0, i + 1).join('/');
                    return [current || '/', labels[current || '/'] || path];
                  }),
          });
        },
        match: undefined,
        history: undefined,
      };
    })
    .context('setBreadcrumb', ({ setBreadcrumb }) => setBreadcrumb)
    .merge({ setBreadcrumb: undefined }) as HOC;

const RouteComponent = ({ component: Comp, render, data, props }) =>
  Comp ? <Comp data={data} {...props} /> : render({ data, ...props });

const Breadcrumb = m
  .doIf(
    ({ label }) => typeof label === 'function',
    m.merge('label', 'match', (label, match) => ({
      label: label(match.params),
    })),
  )
  .doIf(
    ({ label }) => Array.isArray(label),
    m
      .do(getData(({ label }) => label[0]))
      .merge('label', 'data', (label, data) => ({
        label: data ? label[1](data) : '...',
      })),
  )
  .context('setBreadcrumb')
  .merge('label', 'match', 'setBreadcrumb', (label, match, setBreadcrumb) => {
    setBreadcrumb(match.url, label);
  })(({ path, loader, component, render, routeProps, data }) => (
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

export const Breadcrumbs = m.merge('style', style => ({
  style: {
    base: style,
    link: st(style).mergeKeys('link'),
    icon: st(style).scale({ fontSize: 0.9 }),
  },
}))(({ breadcrumbs = [], style }) => (
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
            <Hover style={style.link}>
              {({ hoverProps, style }) => (
                <Txt {...hoverProps} style={style}>
                  {label}
                </Txt>
              )}
            </Hover>
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

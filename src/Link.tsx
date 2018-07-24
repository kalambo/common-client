import * as React from 'react';
import GatsbyLink from 'gatsby-link';

export default ({ to, newTab, route: _, ...props }: any) => {
  const external = to.startsWith('http');
  return external ? (
    <a href={to} target="_blank" {...props} />
  ) : (
    <GatsbyLink to={to} {...(newTab ? { target: '_blank' } : {})} {...props} />
  );
};

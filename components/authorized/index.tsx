import React from 'react';
import { memoize } from 'lodash';

interface AuthorizedProps {
  authority: string;
  children?: React.ReactNode;
}

export const getAuthParse = memoize(function () {
  return sessionStorage.getItem('allResource')
    ? JSON.parse(sessionStorage.getItem('allResource') || '')
    : {};
});

const ButtonAuthorized: React.FunctionComponent<AuthorizedProps> = ({ children, authority }) => {
  const authorizes = getAuthParse();
  authorizes.demo = true;
  if (authorizes[authority]) {
    const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
    return <>{childrenRender}</>;
  }
  return <>{children}</>;
};

export default ButtonAuthorized;

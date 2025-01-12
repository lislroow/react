import React from 'react';
import styled from 'styled-components';

const SearchArea: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default SearchArea;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 29px;
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  margin-bottom: 30px;
  width: 100%;
`;

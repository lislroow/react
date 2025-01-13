import styled, { css } from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 29px;
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  margin-bottom: 30px;
  width: 100%;
`;

export const StylSearchArea: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <Container>{children}</Container>;
};

export const StylSearchGroup = styled.div<{
  wrap?: string;
  mt?: number;
  mb?: number;
  contentAlign?: 'start' | 'center' | 'end' | 'space-between';
}>`
  display: flex;
  width: 100%;
  flex-wrap: ${({ wrap }) => (wrap ? wrap : 'wrap')};
  flex-direction: row;
  align-items: center;
  color: #555;
  margin-top: ${({ mt }) => (mt ? mt + 'px' : '')};
  margin-bottom: ${({ mb }) => (mb ? mb + 'px' : '0px')};
  justify-content: ${({ contentAlign }) => (contentAlign ? contentAlign : 'start')};
  gap: 0px 25px;
  
  .title {
    width: 100px;
    font-size: 14px;
    font-weight: 800;
    margin-right: 15px;
    color: #282a2e;
  }

  .rowTitle {
    width: 100px;
    display: flex;
    font-size: 14px;
    font-weight: 800;
    margin-right: 15px;
    color: #282a2e;
  }

  & > * + * {
  }
`;

export const StylSearchItem = styled.div<{ width?: number; marginBoth?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-right: 50px;
  width: ${({ width }) => (width ? width + 'px' : '')};

  & > * + * {
    margin-left: 10px;
  }
  
  ${(props) =>
    !props.marginBoth &&
    css`
      margin-right: 0px !important;
      margin-left: 0px !important;
    `}
`;

export const StylSearchBtnArea = styled(StylSearchGroup)`
  justify-content: space-between;
  flex-direction: row-reverse;
  margin-top: 10px;

  .right-box {
    display: flex;
    align-items: center;
  }
`;

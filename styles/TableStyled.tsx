import styled from 'styled-components';

export const StyTable = styled.table<{ minWidth?: number }>`
  table-layout: fixed;
  width: ${({ width }) => (width ? width + 'px' : '100%')};
  border-top: 2px solid #000000;
  font-size: 13px;
  min-width: ${({ minWidth }) => (minWidth ? minWidth + 'px' : '1024px')};

  td.empty {
    font-size: 12px;
    width: 100%;
    padding: 100px 0;
    text-align: center;
    border-bottom: 0.5px solid #dbdbdb;
    background-color: #fff;
  }
`;

export const StyThRow = styled.tr`
  font-size: 14px;
  background-color: #eff6f9;
  height: 40px;
  line-height: 20px;
  white-space: pre;

  th {
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;

    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-left: none;
      border-right: none;
    }
  }
`;

export const StyTdRow = styled.tr<{
  pointBackGroundColor?: boolean;
}>`
  background-color: ${({ pointBackGroundColor }) =>
    pointBackGroundColor ? '#fffdeb !important;' : 'white !important;'};
  height: 40px;
  line-height: 20px;
  white-space: pre;

  td {
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    padding: 0 10px;

    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-left: none;
      border-right: none;
    }

    &.sum {
      background-color: #eff6f9;
      font-weight: 800;
    }
  }

  &.sum {
    background-color: #eff6f9;
    font-weight: 800;
  }
`;

export const StyTdRowHover = styled.tr<{
  pointBackGroundColor?: boolean;
}>`
  background-color: ${({ pointBackGroundColor }) =>
    pointBackGroundColor ? '#fffdeb ;' : 'white ;'};
  height: 40px;
  line-height: 20px;
  white-space: pre;
  cursor: pointer;

  td {
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    padding: 0 10px;

    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-left: none;
      border-right: none;
    }

    &.sum {
      background-color: #eff6f9;
      font-weight: 800;
    }
  }

  &.sum {
    background-color: #eff6f9;
    font-weight: 800;
  }

  &:hover {
    background-color: #d3d3d3 !important;
  }
`;

export const Th = styled.th<{ textAlign?: string }>`
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'center')};
  vertical-align: middle;
  font-weight: 800;
  padding: 10px 10px;
  white-space: nowrap;
  background-color:rgb(222, 229, 245);
  border-bottom: 1px solid #dbdbdb;
`;

export const Td = styled.td<{ sort?: string; color?: string; pointBackGroundColor?: boolean }>`
  // text-align: ${({ sort }) => (sort === 'center' && 'center') || (sort === 'end' && 'end')};
  vertical-align: middle;
  padding: 10px 10px;
  background-color: ${({ pointBackGroundColor }) => pointBackGroundColor && 'red !important;'};
  color: ${({ color }) => (color ? color : '#000000')};
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;

  .border-box td:last-child {
    border-left: 1px solid #dbdbdb !important;
    border-right: 1px solid #dbdbdb !important;
  }
  
  &.emptyContent {
    width: fit-content();
    height: 200px;
  }
`;
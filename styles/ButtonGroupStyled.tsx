import { Button } from '@mui/material';
import React, { FC } from 'react';
import styled from 'styled-components';
import styles from '@/css/global.module.css';

const StylButtonGroupWrap = styled.div`
  .buttonGroup {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    height: 40px;
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .btnItemWrap {
    display: flex;
    align-items: center;
    align-items: center;
    height: 40px;
  }

  .btnItem {
    display: flex;
    gap: 12px;
    margin-left: 10px;
  }
`;

export interface ButtonGroupAttr {
  btn1Label?: string;
  btn1OnClick?: () => void;
  btn2Label?: string;
  btn2OnClick?: () => void;
  btn3Label?: string;
  btn3OnClick?: () => void;
  btn4Label?: string;
  btn4OnClick?: () => void;
  btn5Label?: string;
  btn5OnClick?: () => void;
  btn6Label?: string;
  btn6OnClick?: () => void;
}

const StylButtonGroup: FC<ButtonGroupAttr> = ({
  btn1Label,
  btn1OnClick,
  btn2Label,
  btn2OnClick,
  btn3Label,
  btn3OnClick,
  btn4Label,
  btn4OnClick,
  btn5Label,
  btn5OnClick,
  btn6Label,
  btn6OnClick,
}: ButtonGroupAttr) => {
  return (
    <StylButtonGroupWrap>
      <div className="buttonGroup">
        <div className="btnItemWrap">
          <div className="btnItem">
            {btn1OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn1OnClick ?? null}>
                {btn1Label}
              </button>}
          </div>

          <div className="btnItem">
            {btn2OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn2OnClick ?? null}>
                {btn2Label}
              </button>}
          </div>

          <div className="btnItem">
            {btn3OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn3OnClick ?? null}>
                {btn3Label}
              </button>}
          </div>

          <div className="btnItem">
            {btn4OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn4OnClick ?? null}>
                {btn4Label}
              </button>}
          </div>

          <div className="btnItem">
            {btn5OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn5OnClick ?? null}>
                {btn5Label}
              </button>}
          </div>

          <div className="btnItem">
            {btn6OnClick &&
              <button className={styles.button_2} type={'button'} onClick={btn6OnClick ?? null}>
                {btn6Label}
              </button>}
          </div>
        </div>
      </div>
    </StylButtonGroupWrap>
  );
};

export default StylButtonGroup;

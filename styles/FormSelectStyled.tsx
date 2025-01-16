import React from 'react';

export interface SelectAttr {
  type: 'type1' | 'type2' | 'type3';
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'ms';
  name?: string;
  items: Array<SelectItem>;
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  useFirstItem?: boolean;
  onChange?: (e: any) => void;
  value?: any;
  tabIndex?: number;
}

export interface SelectItem {
  label: string;
  value: string;
}

const StylFormSelect: React.FC<SelectAttr> = ({
  type = 'type1',
  size = 'medium',
  name,
  items = [],
  className,
  isDisabled = false,
  useFirstItem = false,
  tabIndex = 1006,
  ...props
}: SelectAttr) => {
  return (
    <>
      <select
        tabIndex={tabIndex}
        className={`select select--${size} select--${type} ${className}`}
        name={name}
        disabled={isDisabled}
        {...props}
      >
        {items.length > 0 &&
          items.map((item, idx) => {
            return idx === 0 && useFirstItem ? (
              <option
                key={`form-select-${idx}`}
                className={`option`}
                value={item.value}
                disabled
                hidden
              >
                {item.label}
              </option>
            ) : (
              <option key={`form-select-${idx}`} className={`option`} value={item.value}>
                {item.label}
              </option>
            );
          })}
      </select>
      <style jsx>{`
        .select {
          border: 1px solid #dbdbdb;
          border-radius: 3px;
          padding-left: 10.5px;
          padding-right: 20.5px;
          color: #000000;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-repeat: no-repeat;
          background-position-x: 93%;
          background-position-y: 50%;
          font-size: 14px;
          font-weight: 400;
          background-color: #ffffff;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .select:disabled {
          background: #f1f1f1 0% 0% no-repeat padding-box;
          border: 1px solid #dbdbdb;
          cursor: not-allowed;
        }
        .option {
          width: 169px;
          height: 40px;

          background: #ffffff 0% 0% no-repeat padding-box;
          border-radius: 3px;
          opacity: 1;
        }
        .select--type2 {
          background-size: 8.29px 6px;
        }
        .select--type2:disabled {
          background-color: #fbfafa;
        }
        .select--type3 {
          background-position-x: 100%;
          border: none;
          padding: 0;
        }
        .select--small {
          width: 92px;
          height: 16px;
        }
        .select--medium {
          width: 160px;
          height: 30px;
        }
        .select--ms {
          width: 110px;
          height: 30px;
        }
        .select--large {
          min-width: 138px;
          height: 40px;
        }
        .select--xlarge {
          width: 253px;
          height: 40px;
        }
        .select--xxlarge {
          width: 305px;
          height: 40px;
        }
        .el-width-400 {
          height: 30px;
          width: 400px;
        }
      `}</style>
    </>
  );
};

export default StylFormSelect;

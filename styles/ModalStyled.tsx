const StylModal = ({
  open,
  handleCloseClick,
  handleOkClick,
  title = '',
  children,
  maxWidth = '400px',
  cancelBtnNm = '취소',
  confirmBtnNm = '확인',
  modelType = 'confirm',
}) => {
  return (
    <>
      <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
          <section className={'modal_wrapper'}>
            <header>
              <button className={'closeIconWrapper'} onClick={() => handleCloseClick()} tabIndex={0}  type={'button'}>
                <div className={'closeIcon'}>
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8bGluZSB4MT0iMSIgeTE9IjEiIHgyPSIxNSIgeTI9IjE1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxsaW5lIHgxPSIxNSIgeTE9IjEiIHgyPSIxIiB5Mj0iMTUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==" alt="닫기" />
                </div>
              </button>
            </header>
            <div className={'header'}>
              <div>{title}</div>
            </div>
            <main>{children}</main>
            <footer>
              {modelType === 'confirm' && (
                <button type="button" tabIndex={20} 
                  onClick={() => handleCloseClick()}>
                  <div>{cancelBtnNm}</div>
                </button>
              )}
              <button
                tabIndex={20}
                style={{
                  marginLeft: '10px',
                  color: '#fff',
                  border: 'none',
                  backgroundColor: '#34A3DB',
                }}
                className="close"
                onClick={() => {
                  handleOkClick();
                }}>
                <div>{confirmBtnNm}</div>
              </button>
            </footer>
          </section>
        ) : null}
      </div>
      <style jsx>{`
        .modal {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 99;
          background-color: rgba(0, 0, 0, 0.6);
        }
        .modal_wrapper {
          padding: 30px 30px;
        }
        .modal button {
          outline: none;
          cursor: pointer;
          border: 0;
        }
        .modal > section {
          width: 90%;
          max-width: ${maxWidth ? maxWidth : '400px'};
          margin: 0 auto;
          border-radius: 0.3rem;
          background-color: #fff;
          animation: modal-show 0.3s;
          overflow: hidden;
        }
        .modal > section > header {
          position: relative;
          display: flex;
          justify-content: flex-end;
          font-weight: 700;
          font-size: 24px;
          color: #000;
        }
        .modal > section > header button {
          width: 30px;
          font-weight: 700;
          text-align: center;
          color: #000;
          background-color: transparent;
          cursor: pointer;
        }
        .modal > section > .header {
          font-size: 24px;
          margin-bottom: 30px;
        }
        .modal > section > main {
        }
        .modal > section > main > p {
          font-size: 14px;
          margin-bottom: 15px;
        }
        .modal > section > footer {
          margin-top: 30px;
          text-align: right;
          display: flex;
          justify-content: flex-end;
        }
        .modal > section > footer button {
          padding: 15px 20px;
          background-color: #fff;
          border-radius: 5px;
          font-size: 13px;
          border: 1px solid #dbdbdb;
          width: 80px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal.openModal {
          display: flex;
          align-items: center;
          animation: modal-bg-show 0.3s;
        }
        .modal > section > main > table {
          border-top: 2px solid #000000;
          width: 100%;
        }
        .modal > section > main > table th {
          background: #eff6f9 0% 0% no-repeat padding-box;
          color: var(--unnamed-color-000000);
          text-align: left;
          letter-spacing: -0.35px;
          color: #000000;
          opacity: 1;
          font-weight: 600;
          font-family: "Noto Sans KR", sans-serif;
          font-size: 14px;
          padding: 20px;
          border-right: 1px solid #dbdbdb;
          border-bottom: 1px solid #dbdbdb;
        }
        .modal > section > main > table td {
          color: var(--unnamed-color-000000);
          text-align: left;
          letter-spacing: -0.35px;
          color: #000000;
          opacity: 1;
          border-bottom: 1px solid #dbdbdb;
          margin-left: 10px;
          font-family: "Noto Sans KR", sans-serif;
          font-size: 14px;
          padding: 10px;
        }
        .modal > section > main > table textArea {
          width: 253px;
          height: 100px;
          padding: 10px;
          border: 1px solid #dbdbdb;
          margin-top: 10px;
        }
        .pwClass {
          width: 253px;
          height: 40px;
          background: #fff 0%0%no-repeat padding-box;
          border: 1px solid#dbdbdb;
          border-radius: 3px;
          border-radius: 3px;
          opacity: 1;
          text-align: left;
          font: normal normal normal 14px/20px Noto Sans KR;
          color: #707070;
          opacity: 1;
          padding: 5px;
        }
        @keyframes modal-show {
          from {
            opacity: 0;
            margin-top: -50px;
          }
          to {
            opacity: 1;
            margin-top: 0;
          }
        }
        @keyframes modal-bg-show {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .closeIconWrapper {
          display: flex;
          justify-content: flex-end;
          border: none;
          background: none;
          font-size: 16px;
          cursor: pointer;
        }
        .closeIcon {
          display: flex;
          width: 35px;
          height: 35px;
          justify-content: center;
          align-content: center;
          align-items: center;
        }
        .closeIcon span {
          font-size: 35px;
        }
        .closeIcon_img {
          width: 36px;
        }
        button:focus-visible {
          outline: 2px solid blue !important;
        }
      `}</style>
    </>
  );
};

export default StylModal;

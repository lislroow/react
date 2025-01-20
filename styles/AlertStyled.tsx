import Box from '@mui/material/Box';
import styles from '@/css/global.module.css';
import React from 'react';

const StylAlert = ({
  attr,
  handleClose,
}) => {
  return (
    <>
      <div className={attr.open ? `${styles.openModal} ${styles.modal}` : 'modal'}>
        {attr.open && (
          <Box className={styles.warning_alert_modal_wrapper}>
            <div className={styles.header}>
              <button className={styles.closeIconWrapper} onClick={() => handleClose()} type={'button'}>
                <div className={styles.closeIcon}>
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8bGluZSB4MT0iMSIgeTE9IjEiIHgyPSIxNSIgeTI9IjE1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxsaW5lIHgxPSIxNSIgeTE9IjEiIHgyPSIxIiB5Mj0iMTUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==" alt="닫기" />
                </div>
              </button>
            </div>
            <div className={''}>
              <section className={styles.alert_content}>
                <article className={styles.title_sub_dec_wrapper}>
                  <div className={styles.alert_msg}>
                    <span className={'alertMessage'}>{attr?.message}</span>
                  </div>
                </article>
              </section>
              <article className={styles.sub_buttons}>
                <button className={styles.button_sm1} type={'button'} onClick={() => handleClose()}>
                  확인
                </button>
              </article>
            </div>
          </Box>
        )}
      </div>
      <style jsx>{`
        @keyframes modal-show {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
        .alertMessage {
          white-space: pre-wrap;
        }
      `}</style>
    </>
  );
};
export default StylAlert;

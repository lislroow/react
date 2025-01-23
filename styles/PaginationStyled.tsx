export interface PaginationAttr {
  total: number;
  size: number;
  page: number;
  onClick: any;
  className?: string;
}

const StylPagination: React.FC<PaginationAttr> = ({
  total = 10,
  size = 1,
  page,
  onClick,
  ...props
}) => {
  const pageSize = 10;
  const numPages = Math.ceil(total / size);
  const pageGroup = Math.ceil(page + 1/ pageSize);
  const lastNumber = pageGroup * pageSize > numPages ? numPages : pageGroup * pageSize;
  const firstNumber = lastNumber - (pageSize - 1) > 0 ? lastNumber - (pageSize - 1) : 0;

  const pageEmt = () => {
    const tempList = [];
    for (let i = firstNumber; i < lastNumber; i++) {
      if (tempList.length >= pageSize) {
        break;
      }
      tempList.push(i);
    }
    return tempList;
  };
  const pageList = pageEmt();
  return (
    <>
      <ul className={`pagination ${props.className}`}>
        {(
          <li className="itemBtn prevBtn first pageBtn" onClick={() => onClick(0)}>{'◀'}</li>
        )}
        {(
          <li className="itemBtn pageBtn" onClick={() => onClick(page < 1 ? 0 : page-1)}>{'◁'}</li>
        )}
        {pageList.map((i) => (
          <li className={`itemBtn ${page === i ? 'active' : null}`} key={i} onClick={() => onClick(i)}>{i+1}</li>
        ))}
        {(
          <li className="itemBtn nextBtn pageBtn" onClick={() => onClick(page + 1 >= numPages ? numPages -1 : page + 1)}>{'▷'}</li>
        )}
        {(
          <li className="itemBtn nextBtn last pageBtn" onClick={() => onClick(numPages-1)}>{'▶'}</li>
        )}
      </ul>
      <style jsx>{`
        .pagination {
          gap: 8px;
          display: flex;
          flex-grow: 1;
          justify-content: center;
          margin: 4rem 0 2rem;
        }
        .pagination > .itemBtn {
          background-color: #fff;
          border: 1px solid #dbdbdb;
          color: #bfbfbf;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.3rem;
          cursor: pointer;
        }
        .pagination > .itemBtn.active {
          background-color: #fff;
          border-color: #000;
          color: #000;
        }
        .pagination > .itemBtn.pageBtn {
          color: #000;
          background-color: #fff;
          cursor: pointer;
          font-weight: 800;
        }
      `}</style>
    </>
  );
};

export default StylPagination;

import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";

import { Layout } from 'components/layout/Layout';
import { asyncGET } from 'utils/http';

type DataType = {
  "email": string,
  "image": string,
  "name": string,
  "birthday": string,
  "gender": string,
  "job": string,
  "isDel": number,
  "createDate": string,
  "modifyDate": string
};

const P01_3 = () => {
  const [ data, setData ] = useState<DataType[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();

  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => 
        json.list.map((row: DataType, idx: number) => ({
          ...row, id: idx
        }))
      )
      .then(json => setData(json));
  };
  useEffect(() => {
    searchParam.set('page', searchParam.get('page') || '1');
    searchParam.set('pageSize', searchParam.get('pageSize') || '10');
    console.log(`[TODO] page=${searchParam.get('page')}, pageSize=${searchParam.get('pageSize')}`);
    asyncGET('/api/admin/sample/customer/page', callback, searchParam);
  }, []);

  const columns: GridColDef[] = [
    {field: 'userId', headerName: 'userId'},
    {field: 'site', headerName: 'site'},
    {field: 'nickname', headerName: '닉네임'},
    {field: 'email', headerName: 'email'},
    {field: 'picture', headerName: '이미지'},
    {field: 'birthday'},
    {field: 'gender'},
    {field: 'job'},
  ];

  return (
    <Layout>
      <div>
        <DataGrid
          columns={columns}
          rows={data}
        />
      </div>
    </Layout>
  )
}

export default P01_3;
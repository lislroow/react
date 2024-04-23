import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";

import { Layout } from 'components/layout/Layout';

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

const P01_2 = () => {
  const [ data, setData ] = useState<DataType[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  useEffect(() => {
    // sync
    // fetch('/api/admin/sample/customer/page')
    //   .then((res) => res.json())
    //   .then((json) => json.map((row: any, idx: number) => ({
    //     ...row, id: idx
    //   })))
    //   .then((json) => setData(json));
    
    // async
    searchParam.set('page', searchParam.get('page') || '1');
    searchParam.set('pageSize', searchParam.get('pageSize') || '10');
    console.log(`[TODO] page=${searchParam.get('page')}, pageSize=${searchParam.get('pageSize')}`);
    const fetchData = async() => {
      const res = await fetch(`/api/admin/sample/customer/page?${searchParam}`);
      let json: any = [];
      if (!res.ok) {
        throw new Error(`fetch 중 오류가 발생했습니다. '${res.status}:${res.statusText}'`);
      }
      return res.json();
    };
    fetchData()
      .then(json => json.list.map((row: DataType, idx: number) => ({
        ...row, id: idx
      })))
      .then(json => setData(json))
      .catch((ex) => console.log(ex))
      ;
  }, []);

  const columns: GridColDef[] = [
    {field: 'userId', headerName: 'userId'},
    {field: 'site', headerName: 'site'},
    {field: 'nickname', headerName: '닉네임'},
    {field: 'email', headerName: 'email'},
    {field: 'picture', headerName: 'picture'},
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

export default P01_2;
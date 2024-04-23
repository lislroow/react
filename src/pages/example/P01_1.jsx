import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Layout } from 'components/layout/Layout';

const P01_1 = () => {
  const [ data, setData ] = useState([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  useEffect(() => {
    // sync
    // fetch(`/api/smpl/customers?${searchParam}`)
    //   .then((res) => res.json())
    //   .then((json) => json.list.map((row, idx) => ({
    //     ...row, id: idx
    //   })))
    //   .then((list) => setData(list));
    searchParam.set('page', searchParam.get('page') || '1');
    searchParam.set('pageSize', searchParam.get('pageSize') || '10');
    console.log(`[TODO] page=${searchParam.get('page')}, pageSize=${searchParam.get('pageSize')}`);
    // async
    const fetchData = async() => {
      const res = await fetch(`/api/smpl/customers?${searchParam}`, {
          method: 'GET'
        });
      let json = [];
      if (res.ok) {
        json = res.json();
      } else {
        throw new Error(`fetch 중 오류가 발생했습니다. '${res.status}:${res.statusText}'`);
      }
      return json;
    };
    fetchData()
      .then(json => {
        const page = json.paged;
        console.log(`page => ${JSON.stringify(page)}`);
        return json;
      })
      .then(json => json.list.map((row, idx) => ({
        ...row, id: idx
      })))
      .then(list => setData(list))
      .catch((ex) => console.log(ex))
      ;
  }, []);
  
  return (
    <Layout>
      <div>
        {/* {
          <ul>
            {
              data.map((row, idx) => (
                <li key={idx}>{idx} - {row.name}</li>
              ))
            }
          </ul>
        } */}
        {JSON.stringify(data)}
      </div>
    </Layout>
  )
};

export default P01_1;
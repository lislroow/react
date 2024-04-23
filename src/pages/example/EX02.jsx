import React, { useState } from 'react';

import { Layout } from 'components/layout/Layout';

import Icon from 'awesome-react-icons';

import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const menuList = [
  {
    title: '주문관리',
    itemId: 'P0001',
    pathname: '/customer/P0001',
    elemBefore: () => <Icon name='coffee' />
  },
  {
    title: '매출관리',
    itemId: 'P0020',
    pathname: null,
    elemBefore: () => <Icon name='coffee' />,
    subNav: [
      {
        title: "일별매출",
        itemId: "P0021",
        pathname: '/customer/P0021',
      },
      {
        title: "월별매출",
        itemId: "P0022",
        pathname: "/customer/P0022",
      }
    ]
  },
  {
    title: 'example',
    itemId: 'PE000',
    pathname: null,
    elemBefore: () => <Icon name='coffee' />,
    subNav: [
      {
        title: "01.counter",
        itemId: "EX01",
        pathname: "/example/EX01",
      },
      {
        title: "02.collection",
        itemId: "EX02",
        pathname: "/example/EX02",
      },
    ]
  }
];

const getPathnameByMenuId = (mlist, itemId) => {
  for (let menu of mlist) {
    if (menu.itemId === itemId) {
      return menu.pathname;
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      var result = getPathnameByMenuId(menu.subNav, itemId);
      if (result != null) {
        return result;
      }
    }
  }
  return null;
}

const getMenuIdByPathname = (mlist, pathname) => {
  for (let menu of mlist) {
    if (menu.pathname === pathname) {
      return menu.itemId;
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      var result = getMenuIdByPathname(menu.subNav, pathname);
      if (result != null) {
        return result;
      }
    }
  }
  return null;
}

const EX02 = () => {
  const location = useLocation();
  const [ inputMenuId, setInputMenuId ] = useState('EX02');
  const [ inputPathname, setInputPathname ] = useState(location.pathname);
  const [ resultPathname, setResultPathname ] = useState(null);
  const [ resultMenuId, setResultMenuId ] = useState(null);
  
  const handleByPathname = (e) => {
    e.preventDefault();
  }

  return (
    <Layout>
      <h2>[EX02] menu-data traversal</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <TextField label="menuId" variant="standard" value={inputMenuId} onChange={(e) => {
              let menuId = e.target.value;
              setInputMenuId(menuId);
              let pathname = getPathnameByMenuId(menuList, menuId);
              console.log(`(selected)menuId='${menuId}', (searched)pathname=${pathname}`);
              setResultPathname(pathname === null ? 'pathname not found' : pathname);
            }}/>
          </Grid>
          <Grid item xs={7}>
            <Typography>{resultPathname}</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField label="pathname" variant="standard" value={inputPathname} onChange={(e) => {
              let pathname = e.target.value;
              setInputPathname(pathname);
              let menuId = getMenuIdByPathname(menuList, pathname);
              console.log(`(selected)pathname=${pathname}, (searched)itemId='${menuId}'`);
              setResultMenuId(menuId === null ? 'menuId not found' : menuId);
            }}/>
          </Grid>
          <Grid item xs={7}>
            <Typography>{resultMenuId}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default EX02;
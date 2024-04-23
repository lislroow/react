import React, { useState } from 'react';

import { Layout } from 'components/layout/Layout';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActions, Typography } from '@mui/material';

const EX01 = () => {
  const [ current, setNumber ] = useState(0);
  const increse = () => {
    setNumber(current + 1);
  };
  const decrese = () => {
    setNumber(current - 1);
  };
  const buttons = [
    <Button key="decrese" variant='outlined' onClick={decrese}>-1</Button>,
    <Button key="increse" variant='contained' onClick={increse}>+1</Button>,
  ];
    
  return (
    <Layout>
      <Card sx={{maxWidth: 230}}>
        <CardContent>
          <Typography variant='h2' align='center'>{current}</Typography>
          <Typography variant='body2' align='center' color='text.secondary'>
            click 'increse' or 'decrese'
          </Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'center'}}>
          <Box
            sx={{
              display: 'flex',
              '& > *': {
                m: 1,
              },
            }}
            >
            <ButtonGroup 
              // orientation='horizental' 
              // variant='contained'
              spacing={2}
              >
              {buttons}
            </ButtonGroup>
          </Box>
        </CardActions>
      </Card>
    </Layout>
  )
}

export default EX01;
import { useRouter } from 'next/router';
import React from 'react';

const Index: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  return (
    <div className='contents'>index page</div>
  )
}

export default Index;

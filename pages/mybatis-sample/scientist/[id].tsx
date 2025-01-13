import { useState, useEffect } from "react";

import {
  ResScientists,
} from '@/types/SampleType';

import SampleService from '@/services/SampleService';
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const [scientist, setScientist] = useState<ResScientists>();
  
  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (!id) {
      router.replace('/mybatis-sample/scientist');
      return;
    }
    SampleService.getScientist(id)
      .then((response) => setScientist(response.data));
  }, [router.isReady]);
  return (
    <div>
      {scientist && (
        <div>{scientist.name}</div>
      )}
    </div>
  );
}

export default Page;

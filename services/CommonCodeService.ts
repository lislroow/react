import { http } from '@/components/http';
import { SelectItem } from '@/styles/FormSelectStyled';

const getCodeByCdGrp = (cdGrp: string) => {
  return http.get(`/story-api/v1/common-code/codes/find/${cdGrp}`);
};

const getFormSelectItem = async (cdGrp: string) : Promise<SelectItem[]>  => {
  try {
    const response = await getCodeByCdGrp(cdGrp);
    const result: SelectItem[] =  response.data.map(item => ({
      label: item.cdNm,
      value: item.cd,
    }));
    result.unshift({
      label: '선택',
      value: '',
    });
    return result;
  } catch (error) {
    return [];
  }
};

const CommonCodeService = {
  getCodeByCdGrp,
  getFormSelectItem,
};

export default CommonCodeService;

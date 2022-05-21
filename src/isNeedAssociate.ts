import { AssoicateObj } from './type/index';
/*
* Determine if you need to associate, exmple: @ewwe
*/
function isNeedAssoicate(inputStr: string): AssoicateObj {
  const obj = {
    isNeed: 0,
    inputStr: '',
  };
  
  const reg = /@(\w|[\u4e00-\u9fa5])+$/;

  if ( reg.test(inputStr) ) {
    obj.isNeed = 1;
    const matchStr = reg.exec(inputStr) || []
    obj.inputStr =matchStr[0] || '';
  }

  return obj;
}

export default isNeedAssoicate;

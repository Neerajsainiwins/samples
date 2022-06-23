import { ITranslation } from "./getLabel";

export const changeListOrder = (arrayObject: any) => {
  arrayObject = arrayObject?.map((element: any, index: any) => {
    element.OrderNumber = index + 1;
    return element;
  })
  return arrayObject;
}


export const reorder = (list: any, startIndex: any, endIndex: any, resultData?: any) => {
  let result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result = changeListOrder(result);
  return result;
};


export const sortTransaction = (translationList: ITranslation[]) => {
  if(!translationList) return []; 
  return translationList.sort((a: any, b: any) => a.LanguageId - b.LanguageId);
};
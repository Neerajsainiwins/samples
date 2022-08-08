export interface ITranslation {
    LanguageId: Number,
    Value: String
  }
let LanguageId = 1
export const getLabel = (translationList: ITranslation[]) => {
    let filteredTranslationObject = translationList.find((translation: ITranslation) => translation.LanguageId === LanguageId);
    let value = filteredTranslationObject?.Value 
    return value
}

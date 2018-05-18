export interface IRestAPICompatible {
  id: string;

  refillFromJson(json: any): IRestAPICompatible;
  toJson(): any;
}

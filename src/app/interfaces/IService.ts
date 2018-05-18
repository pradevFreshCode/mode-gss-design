export interface IService<T> {
  getServiceName(): string;

  fromJson(json): T;

  toJson(entity: T): any;
}

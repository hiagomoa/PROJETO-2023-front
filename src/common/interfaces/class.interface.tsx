import { IStudent } from "./student.interface";

export interface IClass {
  students: IStudent[];
  created_at: string;
  deleted_at?: string;
  id: string;
  name: string;
  professorId: string;
  updated_at: string;
}

import { FunkoPop } from './FunkoPop.js';

export type ResponseType = {
  success: boolean;
  funkoPops?: FunkoPop[];
  message?: string;
};

import { ValidationError } from 'class-validator';

export type ServiceActionOptions = {
  validateDTO?: boolean;
  throwErrorOnValidateFailed?: boolean;
  onError?: (errors: ValidationError[]) => void;
};

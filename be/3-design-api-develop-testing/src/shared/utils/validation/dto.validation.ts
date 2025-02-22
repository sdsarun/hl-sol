import { validate, ValidationError } from 'class-validator';
import { ServiceActionOptions } from 'src/shared/types/service-action';

export async function validateDTO<T extends object>(
  dto: T,
  options?: ServiceActionOptions,
): Promise<ValidationError[]> {
  const errors: ValidationError[] = await validate(dto, { whitelist: true });

  if (errors.length > 0) {
    if (typeof options?.onError === 'function') {
      options?.onError(errors);
    } else {
      const throwErrorOnValidateFailed: boolean =
        options?.throwErrorOnValidateFailed ?? true;
      if (throwErrorOnValidateFailed) {
        throw new Error(errors.toString());
      } else {
        return errors;
      }
    }
  }

  return [];
}

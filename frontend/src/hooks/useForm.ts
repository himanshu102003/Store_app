import { useForm as useHookForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const useForm = <T extends FieldValues>(
  schema: yup.ObjectSchema<yup.AnyObject>,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> => {
  return useHookForm<T>({
    ...options,
    resolver: yupResolver(schema as any),
    mode: 'onChange', // Validate on change
    reValidateMode: 'onChange', // Re-validate on change
  });
};

export const createSchema = <T extends yup.AnyObject>(
  schema: yup.ObjectSchemaDefinition<T>
) => {
  return yup.object().shape(schema);
};

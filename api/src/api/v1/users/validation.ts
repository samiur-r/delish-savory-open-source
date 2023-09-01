import * as yup from 'yup';

export const emailSchema = yup
  .string()
  .typeError('Email must be string')
  .required('Email is required')

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(3, 'Minimum length of password is 3');

import * as yup from 'yup';

export const emailSchema = yup.string().email('Invalid email format').required('Email is required');

export const passwordSchema = yup.string().required('Password is required').min(8, 'Minimum length of password is 8');

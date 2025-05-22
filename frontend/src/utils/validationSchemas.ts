import * as yup from 'yup';

export const emailSchema = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
  .required('Password is required');

export const nameSchema = yup
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .required('Name is required');

export const loginSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['user', 'store_owner'], 'Invalid role')
    .required('Role is required'),
});

export const updatePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

export const storeSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Store name must be at least 3 characters')
    .max(100, 'Store name must be less than 100 characters')
    .required('Store name is required'),
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  address: yup
    .string()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),
});

export const ratingSchema = yup.object().shape({
  value: yup
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .required('Rating is required'),
  comment: yup.string().max(500, 'Comment must be less than 500 characters'),
});

export const profileSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  avatar: yup.string().url('Please enter a valid URL').nullable(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object().shape({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  token: yup.string().required('Token is required'),
});

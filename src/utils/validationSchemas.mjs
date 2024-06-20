export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage:
        "username must be atleast 3 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "username cannot be empty",
    },
    isString: {
      errorMessage: "username must be a string",
    },
  },
  salary: {
    notEmpty: {
      errorMessage: "salary cannot be empty",
    },
  },
  password:{
    notEmpty: {
      errorMessage: "salary cannot be empty",
    },
  }
};
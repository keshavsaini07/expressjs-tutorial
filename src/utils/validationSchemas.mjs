export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage:
        "name must be atleast 3 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "name cannot be empty",
    },
    isString: {
      errorMessage: "name must be a string",
    },
  },
  sal: {
    notEmpty: {
        errorMessage: "sal cannot be empty"
    }
  }
};
import bcrypt from 'bcrypt'

const saltRounds = 10;

// generates hashed version of a password
export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt)
    return bcrypt.hashSync(password, salt);
};

// compares two given passwords
export const comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}
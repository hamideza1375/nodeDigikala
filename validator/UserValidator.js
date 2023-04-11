const Yup = require("yup");


exports.RegisterValidator = Yup.object().shape({
    phoneOrEmail: Yup.string().required(),
    password: Yup.string().min(4).max(20).required(),
});


exports.ResetPasswordValidator = Yup.object().shape({
    password: Yup.string().min(4).max(12).required(),
    repeatPassword: Yup.string().required().oneOf([Yup.ref("password"), null]),
});
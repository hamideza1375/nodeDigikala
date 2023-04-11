const Yup = require("yup");

exports.CategoryValidator = Yup.object().shape({
    title: Yup.string().required(),
});

exports.SellerValidator = Yup.object().shape({
    brand: Yup.string().required(),
    phone: Yup.string().required(),
});

exports.ProductCategoryValidator = Yup.object().shape({
    title: Yup.string().required(),
    price: Yup.number().required(),
    info: Yup.string().required(),
});
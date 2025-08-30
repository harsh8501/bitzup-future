import Joi from "joi";

export const validateGetBalance = (req, res, next) => {
    const schema = Joi.object({
        coin: Joi.string()
            .required()
            .messages({
                'string.base': 'coin must be a string.',
                'string.empty': 'coin cannot be empty.',
                'any.required': 'coin is required.',
            }),
        user_id: Joi.string()
            .required()
            .messages({
                'string.base': 'user_id must be a string.',
                'string.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
    });

    const { error } = schema.validate({
        coin: req.body.coin,
        user_id: req.body.user_id
    });

    if (error) {
        return res.status(200).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateDepositToSubAcc = (req, res, next) => {
    const schema = Joi.object({
        coin: Joi.string()
            .required()
            .messages({
                'string.base': 'coin must be a string.',
                'string.empty': 'coin cannot be empty.',
                'any.required': 'coin is required.',
            }),
        amount: Joi.number()
            .required()
            .positive()
            .messages({
                'number.base': 'amount must be a number.',
                'any.required': 'amount is required.',
            }),
        user_id: Joi.string()
            .required()
            .messages({
                'string.base': 'user_id must be a string.',
                'string.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
    });

    const { error } = schema.validate({
        coin: req.body.coin,
        amount: req.body.amount,
        user_id: req.body.user_id
    });

    if (error) {
        return res.status(200).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}
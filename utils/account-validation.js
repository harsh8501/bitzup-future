import Joi from "joi";

export const validateCreateSubAccount = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string()
            .min(6)
            .max(16)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
            .required()
            .messages({
                'string.base': 'user id must be a string.',
                'string.empty': 'user id cannot be empty.',
                'string.min': 'user id must be at least 6 characters.',
                'string.max': 'user id must not exceed 16 characters.',
                'string.pattern.base': 'user id must contain both letters and numbers, and no special characters.',
                'any.required': 'user id is required.',
            }),
    });

    const { error } = schema.validate({
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

export const validateGetMarginMode = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string()
            .required()
            .messages({
                'string.base': 'user_id must be a string.',
                'string.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
    });

    const { error } = schema.validate({
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
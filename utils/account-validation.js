import Joi from "joi";

export const validateCreateSubAccount = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(6)
            .max(16)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
            .required()
            .messages({
                'string.base': 'Username must be a string.',
                'string.empty': 'Username cannot be empty.',
                'string.min': 'Username must be at least 6 characters.',
                'string.max': 'Username must not exceed 16 characters.',
                'string.pattern.base': 'Username must contain both letters and numbers, and no special characters.',
                'any.required': 'Username is required.',
            }),
    });

    const { error } = schema.validate({
        username: req.body.username
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}
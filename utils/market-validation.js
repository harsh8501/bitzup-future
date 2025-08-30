import Joi from "joi";

export const validateEstLiquidatePrice = (req, res, next) => {
    const schema = Joi.object({
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        side: Joi.string().valid("Buy", "Sell").required().messages({
            'string.base': 'side must be a string.',
            'any.only': 'side must be either Buy or Sell.',
            'any.required': 'side is required.',
        }),
        price: Joi.number().positive().required().messages({
            'number.base': 'price must be a number.',
            'number.positive': 'price must be greater than 0.',
            'any.required': 'price is required.',
        }),
        qty: Joi.number().positive().required().messages({
            'number.base': 'qty must be a number.',
            'number.positive': 'qty must be greater than 0.',
            'any.required': 'qty is required.',
        }),
        leverage: Joi.number().positive().required().messages({
            'number.base': 'leverage must be a number.',
            'number.positive': 'leverage must be greater than 0.',
            'any.required': 'leverage is required.',
        }),
    });

    const { error } = schema.validate({
        symbol: req.body.symbol,
        side: req.body.side,
        price: req.body.price,
        qty: req.body.qty,
        leverage: req.body.leverage
    });

    if (error) {
        return res.status(200).json({
            success: "0",
            message: error.details[0].message,
        });
    }
    next();
}
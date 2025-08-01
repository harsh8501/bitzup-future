import Joi from "joi";

export const validateSetLeverage = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string()
            .required()
            .messages({
                'string.base': 'symbol must be a string.',
                'string.empty': 'symbol cannot be empty.',
                'any.required': 'symbol is required.',
            }),
        leverage: Joi.string()
            .required()
            .messages({
                'string.base': 'leverage must be a number.',
                'string.empty': 'leverage cannot be empty.',
                'any.required': 'leverage is required.',
            }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        symbol: req.body.symbol,
        leverage: req.body.leverage,
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateGetPosition = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),

        quote_coin: Joi.string()
            .required()
            .messages({
                'string.base': 'quote coin must be a string.',
                'string.empty': 'quote coin cannot be empty.',
                'any.required': 'quote coin is required.',
            }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        quote_coin: req.body.quote_coin
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateGetLeverage = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),

        symbol: Joi.string()
            .required()
            .messages({
                'string.base': 'symbol must be a string.',
                'string.empty': 'symbol cannot be empty.',
                'any.required': 'symbol is required.',
            }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        symbol: req.body.symbol
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateSwitchMarginMode = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        margin_mode: Joi.string()
            .required()
            .valid("REGULAR_MARGIN", "ISOLATED_MARGIN")
            .messages({
                'string.base': 'margin_mode must be a string.',
                'any.only': 'margin_mode must be either REGULAR_MARGIN or ISOLATED_MARGIN.',
                'any.required': 'margin_mode is required.',
            }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        margin_mode: req.body.margin_mode
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validatePlaceOrder = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'user_id must be a number.',
            'number.empty': 'user_id cannot be empty.',
            'any.required': 'user_id is required.',
        }),
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
        type: Joi.string().valid("Limit", "Market").required().messages({
            'string.base': 'type must be a string.',
            'any.only': 'type must be either Limit or Market.',
            'any.required': 'type is required.',
        }),
        qty: Joi.number().positive().required().messages({
            'number.base': 'qty must be a number.',
            'number.positive': 'qty must be greater than 0.',
            'any.required': 'qty is required.',
        }),
        price: Joi.when('type', {
            is: 'Limit',
            then: Joi.number().positive().required().messages({
                'number.base': 'price must be a number.',
                'number.positive': 'price must be greater than 0.',
                'any.required': 'price is required for Limit orders.',
            }),
            otherwise: Joi.any().optional()
        }),
        client_order_id: Joi.string()
            .pattern(/^[A-Za-z0-9\-_]{1,36}$/)
            .max(36)
            .optional()
            .messages({
                'string.pattern.base': 'client_order_id must be alphanumeric, dashes, or underscores only.',
                'string.max': 'client_order_id must be at most 36 characters.',
            }),
        reduce_only: Joi.boolean().optional(),
        take_profit: Joi.number().positive().optional().messages({
            'number.base': 'take_profit must be a number.',
            'number.positive': 'take_profit must be greater than 0.',
            'any.required': 'take_profit is required.',
        }),
        stop_loss: Joi.number().positive().optional().messages({
            'number.base': 'stop_loss must be a number.',
            'number.positive': 'stop_loss must be greater than 0.',
            'any.required': 'stop_loss is required.',
        }),
        time_in_force: Joi.when('type', {
            is: 'Limit',
            then: Joi.string().valid("GTC", "IOC", "FOK").optional(),
            otherwise: Joi.optional()
        })
    });

    const { error } = schema.validate(
        {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            side: req.body.side,
            type: req.body.type,
            qty: req.body.qty,
            price: req.body.price,
            client_order_id: req.body.client_order_id,
            reduce_only: req.body.reduce_only,
            take_profit: req.body.take_profit,
            stop_loss: req.body.stop_loss,
            time_in_force: req.body.time_in_force
        }
    );

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
};

export const validateCancelOrder = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'user_id must be a number.',
            'number.empty': 'user_id cannot be empty.',
            'any.required': 'user_id is required.',
        }),
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        order_id: Joi.string().required().messages({
            'string.base': 'order_id must be a string.',
            'string.empty': 'order_id cannot be empty.',
            'any.required': 'order_id is required.',
        }),
    });

    const { error } = schema.validate(
        {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            order_id: req.body.order_id
        }
    );

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
};

export const validateCancelAllOrders = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),

        quote_coin: Joi.string()
            .required()
            .messages({
                'string.base': 'quote coin must be a string.',
                'string.empty': 'quote coin cannot be empty.',
                'any.required': 'quote coin is required.',
            }),
        order_type: Joi.string()
            .required()
            .valid("Order", "StopOrder")
            .messages({
                'string.base': 'order type must be a string.',
                'string.empty': 'order type cannot be empty.',
                'any.required': 'order type is required.',
            }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        quote_coin: req.body.quote_coin,
        order_type: req.body.order_type
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateModifyOrder = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'user_id must be a number.',
            'number.empty': 'user_id cannot be empty.',
            'any.required': 'user_id is required.',
        }),
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        order_id: Joi.string().required().messages({
            'string.base': 'order_id must be a string.',
            'string.empty': 'order_id cannot be empty.',
            'any.required': 'order_id is required.',
        }),
        qty: Joi.number().positive().optional().messages({
            'number.base': 'qty must be a number.',
            'number.positive': 'qty must be greater than 0.',
        }),
        price: Joi.number().positive().optional().messages({
            'number.base': 'price must be a number.',
            'number.positive': 'price must be greater than 0.',
        }),
        client_order_id: Joi.string()
            .pattern(/^[A-Za-z0-9\-_]{1,36}$/)
            .max(36)
            .optional()
            .messages({
                'string.pattern.base': 'client_order_id must be alphanumeric, dashes, or underscores only.',
                'string.max': 'client_order_id must be at most 36 characters.',
            }),
        take_profit: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.number().valid(0)
        ).optional(),
        tp_trigger_by: Joi.string().valid('LastPrice', 'MarkPrice', 'IndexPrice').optional(),
        stop_loss: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.number().valid(0)
        ).optional(),
        sl_trigger_by: Joi.string().valid('LastPrice', 'MarkPrice', 'IndexPrice').optional(),
    });

    const { error } = schema.validate(
        {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            order_id: req.body.order_id,
            qty: req.body.qty,
            price: req.body.price,
            client_order_id: req.body.client_order_id,
            take_profit: req.body.take_profit,
            tp_trigger_by: req.body.tp_trigger_by,
            stop_loss: req.body.stop_loss,
            sl_trigger_by: req.body.sl_trigger_by
        }
    );

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
};

export const validateClosePosition = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'user_id must be a number.',
            'number.empty': 'user_id cannot be empty.',
            'any.required': 'user_id is required.',
        }),
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
        qty: Joi.number().positive().required().messages({
            'number.base': 'qty must be a number.',
            'number.positive': 'qty must be greater than 0.',
            'any.required': 'qty is required.',
        }),
    });

    const { error } = schema.validate(
        {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            side: req.body.side,
            qty: req.body.qty
        }
    );

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
};

export const validateGetOpenOrders = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string().optional().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        quote_coin: Joi.string()
            .optional()
            .messages({
                'string.base': 'quote coin must be a string.',
                'string.empty': 'quote coin cannot be empty.',
                'any.required': 'quote coin is required.',
            }),
        order_type: Joi.string()
            .required()
            .valid("Order", "tpslOrder", "trailingStop")
            .messages({
                'string.base': 'order type must be a string.',
                'string.empty': 'order type cannot be empty.',
                'any.required': 'order type is required.',
            }),
    }).xor('symbol', 'quote_coin');  // either symbol or quote_coin is required

    const { error } = schema.validate({
        user_id: req.body.user_id,
        quote_coin: req.body.quote_coin,
        symbol: req.body.symbol,
        order_type: req.body.order_type
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateGetOrderHistory = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string().optional().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        quote_coin: Joi.string()
            .optional()
            .messages({
                'string.base': 'quote coin must be a string.',
                'string.empty': 'quote coin cannot be empty.',
                'any.required': 'quote coin is required.',
            }),
        limit: Joi.number().required().messages({
            'number.base': 'limit must be a number.',
            'number.empty': 'limit cannot be empty.',
            'any.required': 'limit is required.',
        }),
        startTime: Joi.number().optional().messages({
            'string.base': 'start time must be a string.',
            'string.empty': 'start time cannot be empty.',
            'any.required': 'start time is required.',
        }),
        endTime: Joi.number().optional().messages({
            'string.base': 'end time must be a string.',
            'string.empty': 'end time cannot be empty.',
            'any.required': 'end time is required.',
        }),
        order_type: Joi.string()
            .required()
            .valid("Order", "tpslOrder")
            .messages({
                'string.base': 'order type must be a string.',
                'string.empty': 'order type cannot be empty.',
                'any.required': 'order type is required.',
            }),
    }).xor('symbol', 'quote_coin');  // either symbol or quote_coin is required

    const { error } = schema.validate({
        user_id: req.body.user_id,
        quote_coin: req.body.quote_coin,
        symbol: req.body.symbol,
        limit: req.body.limit,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        order_type: req.body.order_type
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateGetTradeHistoryAndClosedPnL = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string().optional().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        limit: Joi.number().required().messages({
            'number.base': 'limit must be a number.',
            'number.empty': 'limit cannot be empty.',
            'any.required': 'limit is required.',
        }),
        startTime: Joi.number().optional().messages({
            'string.base': 'start time must be a string.',
            'string.empty': 'start time cannot be empty.',
            'any.required': 'start time is required.',
        }),
        endTime: Joi.number().optional().messages({
            'string.base': 'end time must be a string.',
            'string.empty': 'end time cannot be empty.',
            'any.required': 'end time is required.',
        }),
    })

    const { error } = schema.validate({
        user_id: req.body.user_id,
        symbol: req.body.symbol,
        limit: req.body.limit,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateAddIsolatedMargin = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        margin: Joi.number().required().messages({
            'number.base': 'margin must be a number.',
            'number.empty': 'margin cannot be empty.',
            'any.required': 'margin is required.',
        })
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        symbol: req.body.symbol,
        margin: req.body.margin
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateAutoIsolatedMargin = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number()
            .required()
            .messages({
                'number.base': 'user_id must be a number.',
                'number.empty': 'user_id cannot be empty.',
                'any.required': 'user_id is required.',
            }),
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }),
        auto_margin: Joi.number().valid(0, 1).required().messages({
            'number.base': 'auto_margin must be a number.',
            'number.empty': 'auto_margin cannot be empty.',
            'any.required': 'auto_margin is required.',
            'any.only': 'auto_margin must be either 0 or 1.',
        }),
    });

    const { error } = schema.validate({
        user_id: req.body.user_id,
        symbol: req.body.symbol,
        auto_margin: req.body.auto_margin
    });

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
}

export const validateSetTradingStop = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'user_id must be a number.',
            'number.empty': 'user_id cannot be empty.',
            'any.required': 'user_id is required.',
        }),
        symbol: Joi.string().required().messages({
            'string.base': 'symbol must be a string.',
            'string.empty': 'symbol cannot be empty.',
            'any.required': 'symbol is required.',
        }), 
        tp_sl_mode: Joi.string().valid('Full', 'Partial'),
        take_profit: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.number().valid(0)
        ).optional(),
        tp_trigger_by: Joi.string().valid('LastPrice', 'MarkPrice', 'IndexPrice').optional(),
        stop_loss: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.number().valid(0)
        ).optional(),
        sl_trigger_by: Joi.string().valid('LastPrice', 'MarkPrice', 'IndexPrice').optional(),
        qty: Joi.number().positive().when('tp_sl_mode', {
            is: 'Partial',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        tp_order_type: Joi.string().valid('Limit').optional(),
        sl_order_type: Joi.string().valid('Limit').optional(),
        tp_limit_price: Joi.number().positive().optional(),
        sl_limit_price: Joi.number().positive().optional(),
        trailing_stop: Joi.alternatives().try(
            Joi.number().positive(),
            Joi.number().valid(0)
        ).optional(),
        active_price: Joi.number().positive().optional(),
    });

    const { error } = schema.validate(
        {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            tp_sl_mode: req.body.tp_sl_mode,
            take_profit: req.body.take_profit,
            tp_trigger_by: req.body.tp_trigger_by,
            stop_loss: req.body.stop_loss,
            sl_trigger_by: req.body.sl_trigger_by,
            qty: req.body.qty,
            tp_order_type: req.body.tp_order_type,
            sl_order_type: req.body.sl_order_type,
            tp_limit_price: req.body.tp_limit_price,
            sl_limit_price: req.body.sl_limit_price,
            trailing_stop: req.body.traling_stop,
            active_price: req.body.active_price
        }
    );

    if (error) {
        return res.status(400).json({
            success: "0",
            message: error.details[0].message,
        });
    }

    next();
};
const cuid = require('cuid');
const { isEmail } = require('validator');

const db = require('../db');

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: emailSchema({ required: true }),
  products: [
    {
      type: String,
      ref: 'Product',
      index: true,
      required: true,
    }
  ],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
});

function emailSchema (opts = {}) {
  const { required } = opts;
  return {
    type: String,
    required: required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid Email`
    }
  }
}

async function get(_id) {
  const order = await Order.findById(_id)
    .populate('products')
    .exec();

  return order;
}

async function create(fields) {
  return await new Order(fields).save();
}

async function list(opts = {}) {
  const { offset = 0, limit = 25, tag } = opts;
  const query = tag ? { tags: tag } : {};

  const orders = await Order
    .find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    .populate('products')
    .exec();

  return orders;
}

module.exports = {
  get,
  create,
  list,
}

import cartModel from "../models/cart.model.js";
import couponModel from "../models/coupon.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import createInvoice from "../utils/pdf.js";

export const createOrder = async (req, res, next) => {
  const { couponName } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart || cart.products.length === 0) {
    return next(new AppError(`cart is empty`, 400));
  }
  req.body.products = cart.products;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });
    if (!coupon) {
      return next(new AppError(`coupon not found`, 404));
    }
    const currentDate = new Date();
    if (coupon.expireDate <= currentDate) {
      return next(new AppError(`coupon has expried`, 400));
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new AppError(`coupon already used`, 409));
    }
    req.body.coupon = coupon;
  }

  let subTotals = 0;
  let finalProductList = [];
  for (let product of req.body.products) {
    console.log("Product ID:", product.productId);
    console.log("Requested Quantity:", product.quantity);
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });

    if (!checkProduct) {
      return next(new AppError(`product quantity not available`, 400));
    }
    product = product.toObject();
    product.name = checkProduct.name;
    product.unitPrice = checkProduct.price;
    product.discount = checkProduct.discount;
    product.finalPrice = product.quantity * checkProduct.finalPrice;
    subTotals += product.finalPrice;
    finalProductList.push(product);
  }

  const user = await userModel.findById(req.user._id);
  if (!req.body.address) {
    req.body.address = user.address;
  }
  if (!req.body.phoneNumber) {
    req.body.phoneNumber = user.phoneNumber;
  }
  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
  });
  if (order) {
    const invoice = {
      shipping: {
        name: user.username,
        address: order.address,
        phone: order.phoneNumber,
      },
      items: order.products,
      subtotal: order.finalPrice,

      invoice_nr: order._id,
    };

    createInvoice(invoice, "invoice.pdf");

    for (const product of req.body.products) {
      await productModel.updateOne(
        { _id: product.productId },
        { $inc: { stock: -product.quantity } },
      );
    }

    if (req.body.coupon) {
      await couponModel.updateOne(
        { _id: req.body.coupon._id },
        { $addToSet: { usedBy: req.user._id } },
      );
    }

    await cartModel.updateOne(
      { userId: req.user._id },
      {
        products: [],
      },
    );
  }

  return res.status(201).json({ message: "success", order });
};

export const getOrders = async (_, res) => {
  const orders = await orderModel.find({
    $or: [
      {
        status: "pending",
      },
      {
        status: "confirmed",
      },
    ],
  });
  return res.status(200).json({ orders });
};

export const getUserOrders = async (req, res) => {
  const order = await orderModel.find({ userId: req.user._id });
  return res.status(200).json({ order });
};

export const changeStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new AppError(`order not found`, 404));
  }

  order.status = status;
  await order.save();

  return res.status(200).json({ order });
};

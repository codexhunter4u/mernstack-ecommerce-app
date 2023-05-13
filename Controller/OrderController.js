import Gateway from "../Config/PaymentGateway.js";
import OrderModel from "../Models/OrderModel.js";

// Get the braintree token
export const BraintreeToken = async (req, res) => {
  try {
    Gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Error to get the braintree token",
      error: error,
    });
  }
};

// Payment
export const OderPayment = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log(cart);
    let total = 0;

    cart.map((i) => {
      total += i.price;
    });

    const order = new OrderModel({
      products: cart,
      payment: { status: true },
      buyer: req.user._id,
    }).save();

    // Added because payment gateway is not  [If issue resolve remove this block and uncomment below block]
    if (order) {
      return res.status(201).send({
        success: true,
        message: "Payment done and Order save",
      });
    } else {
      return res.status(401).send({
        success: false,
        message: "Payment failt and Order save error",
        error: error,
      });
    }

    // let newTransaction = Gateway.transaction.sale(
    //   {
    //     amount: total,
    //     paymentMethodNonce: nonce,
    //     options: {
    //       submitForSettlement: true,
    //     },
    //   },
    //   function (error, result) {
    //     if (result) {
    //       const order = new OrderModel({
    //         products: cart,
    //         payment: result,
    //         buyer: req.user._id,
    //       }).save();
    //       res.json({ ok: true });
    //     } else {
    //       return res.status(500).send({
    //         success: false,
    //         message: "Error in payment save",
    //         error: error,
    //       });
    //     }
    //   }
    // );
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Error in payment",
      error: error,
    });
  }
};

// Get order by users
export const getOrderByUser = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting order by users",
      error,
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting all orders",
      error,
    });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

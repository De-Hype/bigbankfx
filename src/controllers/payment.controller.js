const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const User = require("../models/user.model");
const https = require("https");
const {
  ValidateInitializePayment,
} = require("../validations/paymentValidation");
const Transaction = require("../models/transaction.model");
const AppResponse = require("../helpers/AppResponse");
const GeneratePublicId = require("../helpers/GeneratePublicId");
require("dotenv").config();

module.exports.InitializePayment = catchAsync(async (req, res, next) => {
  const { value, error } = ValidateInitializePayment(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const user = req.user.payload;

  if (value.publicId != user.publicId)
    return next(new AppError("User Id do not match.", 401));

  const params = JSON.stringify({
    first_name: `${user.first_name}`,
    last_name: `${user.last_name}`,
    email: `${user.email}`,
    publicId: `${user.publicId}`,
    currency: "NGN",
    amount: `${value.amount}00`,
    type: `${value.type}`,
    metadata:user
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BigbankFX_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https
    .request(options, (resPaystack) => {
      let data = "";

      resPaystack.on("data", (chunk) => {
        data += chunk;
      });

      resPaystack.on("end", async () => {
        data = JSON.parse(data);
        const validUser = await User.findOne({ email: user.email }).select("");
        if (!validUser)
          return next(new AppError("User's email does not exist.", 401));

        const transaction = new Transaction({
          userId: validUser._id,
          publicId: GeneratePublicId(456),
          amount: value.amount,
          plan: user.plan,
          reference: data.data.reference,
          isPending: true,
          type: "deposit",
        });

        validUser.transactions.push(transaction._id);
        await Promise.all([validUser.save(), transaction.save()]);
        const userData = {
          publicId: validUser.publicId,
          first_name: validUser.first_name,
          last_name: validUser.last_name,
          username: validUser.username,
          email: validUser.email,
        };
        const transactionData = {
          publicId: transaction.publicId,
          amount: transaction.amount,
          type: transaction.type,
          plan: transaction.plan,
          isPending: transaction.isPending,
          reference: transaction.reference,
        };

        const dataObj = {
          userData: userData,
          transactionData: transactionData,
          data: data,
        };

        return AppResponse(res, "Payment initiated successfully", 200, dataObj);
      });
    })
    .on("error", (error) => {
      // console.error(error);
      throw new Error(`${error.message}`);
    });

  reqPaystack.write(params);
  reqPaystack.end();
});
//This endpoint will be sent to the success page of the frontend
module.exports.VerifyPayment = catchAsync(async (req, res, next) => {
  const reference = req.params.reference;

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.BigbankFX_PAYSTACK_SECRET_KEY}`,
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", async () => {
      const result = JSON.parse(data);
      // return AppResponse(res, "Payment initiated successfully", 200, dataObj);

      res.json({ result });
      if (result.status == true && result.data.status === "success") {
        
      }

      return next(new AppError(`${result.message}`, 402));
    });
  });

  apiReq.on("error", (error) => {
    res.status(500).json({ error: "An error occurred" });
  });

  // End the request
  apiReq.end();
});

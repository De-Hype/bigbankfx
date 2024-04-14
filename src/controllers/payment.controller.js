const AppError = require("../errors/AppError");
const catchAsync = require("../errors/catchAsync");
const { ValidateInitializePayment } = require("../helpers/formValidation");
const User = require("../models/user.model");
const https = require("https");
require("dotenv").config();


module.exports.InitializePayment = catchAsync(async (req, res, next) => {
    const {value, error} = ValidateInitializePayment(req.body);
    if (error){
        return next(new AppError(error.message, 400))
    }
    const user = req.user;
  
//Write the code that should run before we make the payment
  const params = JSON.stringify({
    first_name: `${user.first_name}`,
    last_name: `${user.last_name}`,
    email,
    currency: "NGN",
    amount: `${req.body.amount}00`,
    metadata: req.body.metadata,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.Paystack_Secret_Key}`,
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https
    .request(options, (resPaystack) => {
      let data = "";

      resPaystack.on("data", (chunk) => {
        data += chunk;
      });

      resPaystack.on("end", () => {
        // console.log(JSON.parse(data));
        return res.json(JSON.parse(data));
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
      Authorization: `Bearer ${process.env.Paystack_Secret_Key}`,
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", async () => {
      const result = JSON.parse(data);

      if (result.status != false && result.data.status === "success") {
        const email = result.data.customer.email;
        const subscriber_id = result.data.metadata.user_id;
        const product_ids = result.data.metadata.cart_id;
        const user = await User.findOne({ email });
        if (!user) {
          return next(
            new AppError("User with provided details does not exist", 402)
          );
        }
        
        if (user.id != subscriber_id) {
          return next(new AppError("Invalid user details", 402));
        }
        const courseFetched = await Courses.find({ _id: { $in: product_ids } });

        if (!courseFetched) {
          return next(
            new AppError("Course with provided details does not exist", 402)
          );
        }

        user.courses.push(...product_ids);
        
        await user.populate("courses");

        const isSubscriber = courseFetched.some(course => course.subscribers.includes(subscriber_id));
        
        if (isSubscriber){
          return next(
            new AppError("This user has already bought this course", 402)
          );
        }

        user.courses.forEach((item) => {
          item.lessons.forEach((lesson) => {
            lesson.subscriptionRequired = false;
          });
        });

        //Now lets store the id of the user in our Subscribers model
        courseFetched.forEach(async (courses) => {
          courses.subscribers.push(subscriber_id);
           await courses.save();
        });
        await user.save();
        return res.status(200).json({ user, courseFetched, result });
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

// Import necessary modules and packages
var uniqid = require('uniqid');  // for generating unique id for payment methods
const { generateToken } = require("../config/jwtToken"); // Import the function to generate JWT tokens
const User = require("../models/userModel"); // Import the User model
const Product = require("../models/productModel"); // Import the Product model
const Coupon = require("../models/couponModel"); // Import the coupon model
const Order = require("../models/orderModel"); // Import the Order model
const Cart = require("../models/cartModel"); // Import the Product model
const asyncHandler = require("express-async-handler"); // Import the express-async-handler utility
const validateMongoDbId = require("../utils/ValidateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./emailControl");

// Controller function for creating a new user
const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body.email;
    const findUser = await User.findOne({ email });

    if (!findUser) {
        // Create a new user if not found
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // Throw an error if the user already exists
        throw new Error('User Already Exists');
    }
});

// Controller function for user login
// Login User Controller
const loginUserCtrl = asyncHandler(async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if user exists and the password matches
    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {
        // Generate a new refresh token
        const refreshToken = await generateRefreshToken(findUser?._id);

        // Update the user's document with the new refresh token
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, { new: true });

        // Set the refresh token as an HTTP-only cookie with a 72-hour expiry
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        // If user exists and password matches, send user details and a JWT token in the response
        res.json({
            _id: findUser?._id,
            fname: findUser?.fname,
            lname: findUser?.lname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        // Throw an error for invalid credentials
        throw new Error("Invalid Credentials");
    }
});


//Admin login

// Controller function for user login
// Login User Controller
const loginAdmin = asyncHandler(async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if user exists and the password matches
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') {
        throw new Error("Not Authorized");
    }
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        // Generate a new refresh token
        const refreshToken = await generateRefreshToken(findAdmin?._id);

        // Update the user's document with the new refresh token
        const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken,
        }, { new: true });

        // Set the refresh token as an HTTP-only cookie with a 72-hour expiry
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        // If user exists and password matches, send user details and a JWT token in the response
        res.json({
            _id: findAdmin?._id,
            fname: findAdmin?.fname,
            lname: findAdmin?.lname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        // Throw an error for invalid credentials
        throw new Error("Invalid Credentials");
    }
});

// Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    // Use object destructuring to access the refreshToken property in the cookies object
    const { refreshToken } = req.cookies;

    // Check if the refresh token is present in cookies
    if (!refreshToken) {
        throw new Error('No refresh token in cookies');
    }

    // Find user by refresh token in the database
    const user = await User.findOne({ refreshToken });

    // If no user is found, throw an error
    if (!user) {
        throw new Error('No refresh token exists in the database');
    }

    // Verify the refresh token and decode it
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refreshToken');
        }

        // Generate a new access token and send it in the response
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });

    // Respond with the user object (Note: this line might not be reached due to the previous response)
    res.json(user);
});

// Logout Functionality
const logout = asyncHandler(async (req, res) => {
    // Extract refresh token from cookies
    const { refreshToken } = req.cookies;

    // Check if the refresh token is present in cookies
    if (!refreshToken) {
        throw new Error('No refresh token in cookies');
    }

    // Find user by refresh token in the database
    const user = await User.findOne({ refreshToken });

    // If no user is found, clear the cookie and return forbidden status
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // Forbidden
    }

    // Update the user's document with an empty refresh token
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });

    // Clear the refresh token cookie and respond with forbidden status
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // Forbidden
});


// Update a user
const updateSingleUser = asyncHandler(async (req, res) => {
    // Extract user ID from the authenticated user in the request
    const { id } = req.user;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Update user information in the database based on the provided ID
        const updateUser = await User.findByIdAndUpdate(id, {
            fname: req?.body.fname,
            lname: req?.body.lname,
            email: req?.body.email,
            mobile: req?.body.mobile
        }, { new: true });
        // Respond with the updated user information
        res.json(updateUser);
    } catch (error) {
        // Throw an error if there's an issue updating the user
        throw new Error(error);
    }
});


//save user address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Update user information in the database based on the provided ID
        const updateUser = await User.findByIdAndUpdate(id, {
            address: req?.body?.address,
        }, { new: true });
        // Respond with the updated user information
        res.json(updateUser);
    } catch (error) {
        // Throw an error if there's an issue updating the user
        throw new Error(error);
    }
})

// Controller function to get all users
const getAllUser = asyncHandler(async (req, res) => {
    try {
        // Retrieve all users from the database
        const getUsers = await User.find();
        // Respond with the array of user objects
        res.json(getUsers);
    } catch (error) {
        // Throw an error if there's an issue retrieving users
        throw new Error(error);
    }
});

// Controller function to get a single user
const getSingleUser = asyncHandler(async (req, res) => {
    // Extract user ID from the request parameters
    const { id } = req.params;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Retrieve a single user from the database based on the provided ID
        const getUser = await User.findById(id);
        // Respond with the user information
        res.json({ getUser });
    } catch (error) {
        // Throw an error if there's an issue retrieving the user
        throw new Error(error);
    }
});

// Controller function to delete a single user
const deleteSingleUser = asyncHandler(async (req, res) => {
    // Extract user ID from the request parameters
    const { id } = req.params;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Delete a user in the database based on the provided ID
        const deleteUser = await User.findByIdAndDelete(id);
        // Respond with the deleted user information
        res.json({ deleteUser });
    } catch (error) {
        // Throw an error if there's an issue deleting the user
        throw new Error(error);
    }
});

// Controller function to block a user
const blockUser = asyncHandler(async (req, res) => {
    // Extract user ID from the request parameters
    const { id } = req.params;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Update the user's 'isBlocked' field to 'true' in the database based on the provided ID
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        }, { new: true });
        // Respond with the updated user information
        res.json(block);
    } catch (error) {
        // Throw an error if there's an issue blocking the user
        throw new Error(error);
    };
});

// Controller function to unblock a user
const unBlockUser = asyncHandler(async (req, res) => {
    // Extract user ID from the request parameters
    const { id } = req.params;
    // Validate the MongoDB ID
    validateMongoDbId(id);
    try {
        // Update the user's 'isBlocked' field to 'false' in the database based on the provided ID
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, { new: true });
        // Respond with the updated user information
        res.json(unblock);
    } catch (error) {
        // Throw an error if there's an issue unblocking the user
        throw new Error(error);
    };
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) { throw new Error("User not found with email: " + email); }
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now.<a href="http://localhost:5000/api/user/reset-password/${token}">click here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "forgot password link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json({ token });
    }
    catch (error) {
        throw new Error(error)
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) { throw new Error('token expired, Please try again later'); }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);

    } catch (error) {
        throw new Error(error);
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        let products = [];
        const user = await User.findById(_id);
        //check if user already have products in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            await Cart.findOneAndDelete({ orderby: user._id });
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});


const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndDelete({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error('Invalid Coupon');
    }
    const user = await User.findOne({ _id });
    const cart = await Cart.findOne({ orderby: user._id }).populate("products.product");
    if (!cart) {
        throw new Error('Cart not found');
    }
    let cartTotal = 0;
    for (const item of cart.products) {
        cartTotal += item.product.price * item.count;
    }

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    cart.totalAfterDiscount = totalAfterDiscount;
    await cart.save();
    res.json(totalAfterDiscount)


});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        if (!COD) {
            throw new Error('Create cash order failed');
        }
        const user = await User.findById({ _id });
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({ products: userCart.products, paymentIntent: { id: uniqid(), method: "COD", amount: finalAmount, status: "Cash On Delivery", currency: "₹" }, orderby: user._id, orderStatus: "Cash On Delivery" }).save()

        let updateQuantity = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updated = await Product.bulkWrite(updateQuantity, {});
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }

});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const userOrders = await Order.findOne({ orderby: _id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userOrders);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const allUsersOrders = await Order.find()
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(allUsersOrders);
    } catch (error) {
      throw new Error(error);
    }
  });


  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      throw new Error(error);
    }
  });

// Export the controller functions
module.exports = { createUser, loginUserCtrl, loginAdmin, getAllUser, getSingleUser, deleteSingleUser, handleRefreshToken, logout, updateSingleUser, blockUser, unBlockUser, updatePassword, forgotPasswordToken, resetPassword, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, getAllOrders, updateOrderStatus };

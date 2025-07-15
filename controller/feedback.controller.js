import QuerMailer from "../Nodemailer/QueryMailer.js";
import ResponseToUser from "../Nodemailer/ResponseToUser.js";
import FooterMailer from "../Nodemailer/FooterMailer.js";

export const queryMessage = async (req, res, next) => {
  console.log(req.body);
  const { userName, userEmail, userMessage } = req.body;

  try {
    await QuerMailer(userName, userEmail, userMessage);

    res.json({
      message: "Mail Send Successfully !!",
    });
  } catch (error) {
    next(error.message);
  }
};

export const footerMailer = async (req, res, next) => {
  const { name, email, message } = req.body;
  try {
    console.log(name, email, message);

    await FooterMailer(name, email, message);

     res.json({
      message: "Mail Send Successfully !!",
    });
  } catch (err) {
    next(err.message);
  }
};

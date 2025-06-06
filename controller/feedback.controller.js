import QuerMailer from "../Nodemailer/QueryMailer.js";
import ResponseToUser from "../Nodemailer/ResponseToUser.js";

export const queryMessage = async (req, res, next) => {
  console.log(req.body);
  const { userName, userEmail, userMessage } = req.body;

  try {
    QuerMailer(userName, userEmail, userMessage);


    res.json({
      message: "Mail Send Successfully !!",
    });
  } catch (error) {
    next(error.message);
  }
};

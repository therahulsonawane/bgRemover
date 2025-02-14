import { EnvironmentOut, Webhook } from "svix";
import userModel from "../models/userModel.js";
// ApI controller function to manage clerk user with database
//http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    //Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkID: data.id,
          email: data.email_addresses[0].email_address, 
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        res.JSON({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.findOneAndUpdate({ clerkID: data.id }, userData);
        res.JSON({});
        break;
      }
      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkID: data.id });
        res.JSON({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.JSON({ sucess: false, message: error.message });
  }
};

export { clerkWebhooks };

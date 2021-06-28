import Axios from "axios";
import { atlasAPI, emailAPI } from "../endpoints";

export const EmailManager = {

  confirmEmail: async (emailBody) => {
    const config = {};
    try {
      return await emailAPI.post(
        '/confirmation',
        emailBody,
        config
      )
    } catch (error) {
      console.log(error)
      return null;
    }
  },

}
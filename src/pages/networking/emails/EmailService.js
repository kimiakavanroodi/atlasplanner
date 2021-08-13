import React from "react";
import { EventService } from "../events/EventService";
import { EmailManager } from "./EmailManager";

export const EmailService = {

    sendConfirmEmail: async(emailBody) => {
        try {
            return new Promise((resolve, reject) => {
                EmailManager.confirmEmail(emailBody).then((exp) => {
                    if (exp != null && exp) {
                        if (exp) {
                            console.log(exp)
                            resolve(exp["data"]);
                        } else {
                            resolve(null);
                        }
                    }
                }, reject);
            })
        } catch (err) {
            console.log('Cannot send confirmation email.')
            return null;
        }
    },

    sendHostCancelEmail: async(emailBody) => {
        try {
            return new Promise((resolve, reject) => {
                EmailManager.hostCancels(emailBody).then((exp) => {
                    if (exp != null && exp) {
                        if (exp) {
                            console.log(exp)
                            resolve(exp["data"]);
                        } else {
                            resolve(null);
                        }
                    }
                }, reject);
            })
        } catch (err) {
            console.log('Cannot send host cancellation email.')
            return null;
        }
    },

    sendCancelEmail: async(emailBody) => {
        try {
            return new Promise((resolve, reject) => {
                EmailManager.cancelEmail(emailBody).then((exp) => {
                    if (exp != null && exp) {
                        if (exp) {
                            console.log(exp)
                            resolve(exp["data"]);
                        } else {
                            resolve(null);
                        }
                    }
                }, reject);
            })
        } catch (err) {
            console.log('Cannot send cancellation email.')
            return null;
        }
    },

    sendReserveEmail: async(emailInfo) => {
        try {
            return new Promise((resolve, reject) => {
                EmailManager.reserveEmail(emailInfo).then((exp) => {
                    if (exp != null && exp) {
                        if (exp) {
                            console.log(exp)
                            resolve(exp["data"]);
                        } else {
                            resolve(null);
                        }
                    }
                }, reject);
            })
        } catch (err) {
            console.log('Cannot send reservation email.')
            return null;
        }
    }

}

import mongoose from "mongoose";
export const isValid = function (value) {
  if (typeof value === "undefined" || typeof value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

export const nameFormet = function (value) {
  const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
  if (!regex.test(value)) return false;
  return true;
};

export const isValidNumber = function (value) {
  const noNumber = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/g;
  if (typeof value !== "string") return false;
  if (noNumber.test(value) === false) return false;
  return true;
};

export const isValidEmail = function (value) {
  let mailFormat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  if (!value.match(mailFormat)) return false;
  return true;
};

export const isValidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
};

export const isValidObjectId = function(ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

export const isValidPincode = function (value) {
  let pinCodeValidation = /^[0-9]{6}$/;
  if (!pinCodeValidation.test(value)) return false;
  return true;
};

export const isValidPassword = function (value) {
  let passwordPattern = /^[a-zA-Z0-9!@#$%&*]{8,15}$/;
  if (!passwordPattern.test(value)) return false;
  return true;
};

const validSize = function (value) {
  let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) return true;
  }
  return false;
};

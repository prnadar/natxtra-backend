import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()

      .required("Password is required"),
  })
  .required();

export const SignupSchema = yup
  .object({
    name: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\+?[1-9]\d{1,9}$/, "Invalid phone number")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();
// Validation schema using yup
export const ForgetSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  })
  .required();

// Validation schema using yup
export const ChangePasswordSchema = yup
  .object({
    password: yup.string().required("Current password is required"),
    new_password: yup
      .string()
      .min(8, "New password must be at least 8 characters")
      .required("New password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm new password is required"),
  })
  .required();

// Validation schema using yup
export const EditAddressSchema = yup
  .object({
    name: yup.string().required("Full name is required"),
    phone: yup
      .string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .required("Phone number is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pincode: yup
      .string()
      .matches(/^\d{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    address_type: yup
      .string()
      .oneOf(["shipping", "delivery"], "Invalid address type")
      .required("Address type is required"),
  })
  .required();

// Validation schema for contact form
export const contactSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\+?[1-9]\d{1,9}$/, {
        message: "Invalid phone number",
        excludeEmptyString: true,
      })
      .optional(),
    subject: yup
      .string()
      .oneOf(
        [
          "product-inquiry",
          "custom-order",
          "installation",
          "warranty",
          "feedback",
          "other",
        ],
        "Please select a valid subject"
      )
      .required("Subject is required"),
    message: yup.string().required("Message is required"),
    privacy: yup
      .boolean()
      .oneOf([true], "You must agree to the privacy policy")
      .required("You must agree to the privacy policy"),
  })
  .required();

export const ResetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

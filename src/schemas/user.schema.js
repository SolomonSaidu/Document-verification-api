import z, { email } from "zod";

const userSchema = z.object({
  email: z.email("Please provide a valid email."),
  password: z
    .string("Password must be a string.")
    .min(6, "Password must be at least 6 character,")
    .max(20, "Password should not be more than 20 character"),
});

export default userSchema;

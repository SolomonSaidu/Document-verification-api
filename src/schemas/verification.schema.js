import z from "zod";

const verificationSchema = z.object({
  document_type: z.enum(
    ["ELECTRICITY_BILL", "WATER_BILL", "BANK_STATMENT"],
    "Invalid document type.",
  ),
});

export default verificationSchema;

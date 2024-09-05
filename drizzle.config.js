/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  dbCredentials: {
    url: 'postgresql://prepai_owner:K3MNtmDF0SzW@ep-frosty-firefly-a5mo65hl.us-east-2.aws.neon.tech/prepai?sslmode=require',
  }
};
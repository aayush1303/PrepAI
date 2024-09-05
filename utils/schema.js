import { varchar, text, serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";


// Define your table using PostgreSQL-specific column types
export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', 255).notNull(),   
    jobDesc: varchar('jobDesc', 255).notNull(),           
    jobExperience: varchar('jobExperience', 255).notNull(), 
    createdBy: varchar('createdBy', 255).notNull(),       
    createdAt: varchar('createdAt', 255),                 
    mockId: varchar('mockId', 255).notNull(),             
});

//user answer
export const UserAnswer = pgTable('userAnswer', {
   id: serial('id').primaryKey(),
   mockIdRef: varchar('mockId', 255).notNull(),
   question:varchar('question', 255).notNull(),
   correctAns:text('correctAns').notNull(),
    userAns:text('userAns').notNull(),
    feedback:text('feedback').notNull(),
    rating:varchar('rating', 255).notNull(),
    userEmail:varchar('userEmail', 255).notNull(),
    createdAt: varchar('createdAt', 255),
});
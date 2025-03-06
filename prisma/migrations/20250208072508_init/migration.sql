-- CreateTable
CREATE TABLE "credit_package" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "credit_amount" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_package_pkey" PRIMARY KEY ("id")
);

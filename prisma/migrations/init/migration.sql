-- CreateTable
CREATE TABLE "Feedbacks" (
    "FeedbackId" UUID NOT NULL,
    "Name" VARCHAR(255),
    "Email" VARCHAR(255),
    "Message" TEXT,
    "CreatedDate" TIMESTAMP(6),

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("FeedbackId")
);

-- CreateTable
CREATE TABLE "adminusers" (
    "AdminUserID" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "Username" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "CreatedDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adminusers_pkey" PRIMARY KEY ("AdminUserID")
);

-- CreateTable
CREATE TABLE "company" (
    "CompanyId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "CompanyName" VARCHAR(255) NOT NULL,
    "CompanyDescription" TEXT NOT NULL,
    "CompanyLogo" TEXT,
    "CompanyLocation" TEXT NOT NULL,
    "IndustryID" UUID,
    "NoOfEmployeeID" UUID,

    CONSTRAINT "company_pkey" PRIMARY KEY ("CompanyId")
);

-- CreateTable
CREATE TABLE "companydepartment" (
    "CompanyDepartmentID" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "CompanyId" UUID,
    "DepartmentId" UUID,

    CONSTRAINT "companydepartment_pkey" PRIMARY KEY ("CompanyDepartmentID")
);

-- CreateTable
CREATE TABLE "companyuser" (
    "CompanyUserId" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "FirstName" VARCHAR(255),
    "LastName" VARCHAR(255),
    "Username" VARCHAR(255),
    "Email" VARCHAR(255),
    "Password" VARCHAR(255),
    "UserMobile" VARCHAR(50),
    "Status" VARCHAR(50),
    "OTP" VARCHAR(6),
    "LastOTPRequestedAt" TIMESTAMP(6),
    "CompanyCreatedDate" TIMESTAMP(6),
    "CompanyId" UUID,
    "LastUpdatedDate" DATE,

    CONSTRAINT "companyuser_pkey" PRIMARY KEY ("CompanyUserId")
);

-- CreateTable
CREATE TABLE "departments" (
    "DepartmentID" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "DepartmentName" VARCHAR(255) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("DepartmentID")
);

-- CreateTable
CREATE TABLE "industries" (
    "IndustryID" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "IndustryName" VARCHAR(255) NOT NULL,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("IndustryID")
);

-- CreateTable
CREATE TABLE "job" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "position" VARCHAR(300) NOT NULL,
    "postedDate" TIMESTAMP(6) NOT NULL,
    "description" VARCHAR(2000) NOT NULL,
    "requirements" VARCHAR(2500),
    "image" VARCHAR(2000),
    "type" VARCHAR(255) NOT NULL,
    "companyId" UUID,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noofemployees" (
    "NoOfEmployeeID" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "NoOfEmployeeType" VARCHAR(255) NOT NULL,

    CONSTRAINT "noofemployees_pkey" PRIMARY KEY ("NoOfEmployeeID")
);

-- CreateIndex
CREATE UNIQUE INDEX "adminusers_Username_key" ON "adminusers"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "adminusers_Email_key" ON "adminusers"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "companyuser_Email_key" ON "companyuser"("Email");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "FK_Company_Industry" FOREIGN KEY ("IndustryID") REFERENCES "industries"("IndustryID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "FK_Company_NoOfEmployee" FOREIGN KEY ("NoOfEmployeeID") REFERENCES "noofemployees"("NoOfEmployeeID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companydepartment" ADD CONSTRAINT "FK_CompanyDepartment_Company" FOREIGN KEY ("CompanyId") REFERENCES "company"("CompanyId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companydepartment" ADD CONSTRAINT "FK_CompanyDepartment_Department" FOREIGN KEY ("DepartmentId") REFERENCES "departments"("DepartmentID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "companyuser" ADD CONSTRAINT "FK_CompanyUser_Company" FOREIGN KEY ("CompanyId") REFERENCES "company"("CompanyId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_CompanyId" FOREIGN KEY ("companyId") REFERENCES "company"("CompanyId") ON DELETE NO ACTION ON UPDATE NO ACTION;


import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUserAndPermission1717270761495 implements MigrationInterface {
  name = 'CreateTableUserAndPermission1717270761495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."permission_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "details" text NOT NULL, "status" "public"."permission_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('MALE', 'FEMALE')`);
    await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(`CREATE TYPE "public"."user_rolecode_enum" AS ENUM('ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'CUSTOMER')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" text NOT NULL, "fullName" text NOT NULL, "description" text NOT NULL, "password" text NOT NULL, "phoneNumber" text NOT NULL, "gender" "public"."user_gender_enum" NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'ACTIVE', "roleCode" "public"."user_rolecode_enum" NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_rolecode_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TYPE "public"."permission_status_enum"`);
  }
}

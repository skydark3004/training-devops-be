import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1717082748323 implements MigrationInterface {
  name = 'Init1717082748323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "character" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "thumbnail" text DEFAULT 'https://random.imagecdn.app/500/150', "test" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "character"`);
  }
}

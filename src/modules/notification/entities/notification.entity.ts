import { Schedule } from "src/modules/schedule/entities/schedule.entity";
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'schedule_id' })
    scheduleId: number;

    @CreateDateColumn({
        name: 'created_at',
        nullable: true
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        nullable: true
    })
    deletedAt: Date;

    @BeforeInsert()
  public setCreateDate(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }

  @BeforeSoftRemove()
  public setDeleteDate(): void {
    this.deletedAt = new Date();
  }

  @OneToOne(() => Schedule)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
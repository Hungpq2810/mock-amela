import { Exclude } from 'class-transformer';
import { Role } from 'src/enums/index.enum';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';
import { TimeKeeping } from 'src/modules/timekeeping/entities/timekeeping.entity';
import {
  BeforeInsert,
  BeforeSoftRemove,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Exclude()
  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'fullname', nullable: false })
  fullname: string;

  @Column({ name: 'phone', nullable: false })
  phone: string;

  @Column({ name: 'job_id', nullable: true })
  jobId: number;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ name: 'role', nullable: false, default: Role.USER })
  role: Role;

  @Column({ name: 'is_active', nullable: false, default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', nullable: false, default: false })
  isVerified: boolean;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
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

  @ManyToOne(() => Job, (job) => job.id)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => TimeKeeping, (timeKeeping) => timeKeeping.user)
  timekeepings: TimeKeeping[];

  @OneToMany(() => Schedule, (schedule) => schedule.sender)
  sendSchedules: Schedule[];

  @OneToMany(() => Schedule, (schedule) => schedule.receiver)
  receiveSchedules: Schedule[];
}

import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreateEvaluationDto {
  @IsUUID()
  enrollmentId: string;

  @IsInt()
  @Min(1)
  @Max(7)
  score: number;

  @IsNotEmpty()
  comment: string;
}

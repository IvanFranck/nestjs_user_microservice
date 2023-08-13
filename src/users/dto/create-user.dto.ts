export interface CreateUserDto {
  email: string;
  password: string;
  avatar?: string;
}

export interface UserAvatarUploadedEventPayload {
  filename: string;
}

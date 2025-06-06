import {UsersType} from "@/app/types/users";

export interface AuthType {
    user: UsersType | null;
    token: string | null
}
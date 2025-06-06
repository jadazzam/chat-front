import {UsersType} from "@/app/types/users";

export interface SignInType {
    user: UsersType | null;
    token: string | null
}
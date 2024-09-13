export interface ILogin {
     email: string;
     password: string;
}

export interface IUserCreate {
     email: string;
     password: string;
     firstName: string;
     lastName: string;
     role: string[];
}

export interface IUserProfile {
     email: string;
     firstName: string;
     lastName: string;
     role: string[];
}





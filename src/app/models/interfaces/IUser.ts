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


export interface IUserList {
     id: string;
     username: string;
     email: string;
     lname: string;
     fname: string;
     mname: string;
     role: string[];
}

export interface IUserRegister {
     username: string;
     email: string;
     lname: string;
     fname: string;
     mname: string;
     roleId: string;
     password: string;
}



